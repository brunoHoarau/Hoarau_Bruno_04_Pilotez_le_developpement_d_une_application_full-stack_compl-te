# Migrations TypeORM (sans seeder)

**Date** : 2026-08-21
**Statut** : Approuvé, en attente d'implémentation

## Contexte

Le projet utilise actuellement `synchronize: true` (dev) dans `app.module.ts` : TypeORM compare les entités au schéma réel de la base PostgreSQL et modifie automatiquement les tables à chaque démarrage. Ce mode n'est pas versionné, peut entraîner des pertes de données silencieuses, et est désactivé en production (`NODE_ENV === 'production'`) sans alternative de remplacement.

L'objectif de ce travail est d'introduire des **migrations TypeORM versionnées** avec un **runner** qui les applique automatiquement au démarrage, et de désactiver `synchronize` définitivement.

## Décisions prises

- **Migrations + `synchronize` désactivé**, en dev comme en prod (pas de mode hybride).
- **Pas de seeder ni de Factory** : la base démarre vide. Le premier compte utilisateur est créé par l'utilisateur final via `POST /auth/register` — aucune donnée de démonstration ou de compte admin pré-créé n'est nécessaire.
- **Reset complet du volume Docker de dev** (`docker compose down -v`) pour repartir d'une base vide, plutôt que de baseliner une migration sur un schéma déjà créé par `synchronize`.
- **Exécution automatique des migrations au démarrage** (`migrationsRun: true`), pas de commande manuelle à lancer avant `npm run start:dev`.

## Hors périmètre

Ces points sont connus mais **ne sont pas traités** par ce travail (voir README, section "Points d'attention connus") :
- Le bug JWT header/cookie (`JwtStrategy` lit `request.cookies.access_token` alors que le login renvoie le token en JSON, sans `cookie-parser` monté).
- `UsersService.findOneById`, `update`, `remove` non implémentés.
- L'absence de `ValidationPipe` global (les DTO ne sont pas validés à l'exécution).
- Le doublon fonctionnel `POST /users` / `POST /auth/register`.

## Architecture

Une seule source de vérité pour la configuration de connexion TypeORM : `src/database/data-source.ts`. Ce fichier exporte :
- `dataSourceOptions` : l'objet de configuration (`type`, `url`, `entities`, `migrations`, `migrationsRun`, `synchronize: false`).
- `AppDataSource` : une instance `DataSource` construite à partir de `dataSourceOptions`, utilisée uniquement par le CLI TypeORM (hors contexte Nest).

Ce fichier est consommé à deux endroits :
1. **`app.module.ts`** : `TypeOrmModule.forRoot(dataSourceOptions)` remplace l'actuel `TypeOrmModule.forRootAsync(...)` basé sur `ConfigService`. La config DB n'a plus besoin de `ConfigService` puisque `data-source.ts` lit `process.env` directement (via `dotenv`) — `ConfigModule.forRoot({ isGlobal: true })` reste utile pour le reste de l'app (`JWT_SECRET` notamment).
2. **Le CLI TypeORM** (`typeorm-ts-node-commonjs`), invoqué via des scripts npm, pour générer/exécuter/annuler des migrations en dehors du cycle de vie Nest.

## Fichiers créés / modifiés

```
src/database/
├── data-source.ts                        # NOUVEAU
├── migrations/
│   └── <timestamp>-InitSchema.ts         # NOUVEAU — généré depuis l'entité User contre une base vide
└── entities/
    └── user.entity.ts                     # inchangé

src/app.module.ts                          # MODIFIÉ
package.json                               # MODIFIÉ
README.md                                  # MODIFIÉ — section base de données mise à jour
```

### `src/database/data-source.ts`

```ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsRun: true,
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
```

### `app.module.ts`

```ts
TypeOrmModule.forRoot(dataSourceOptions),
TypeOrmModule.forFeature([User]),
```
(le reste du module — `ConfigModule`, `JwtModule` — ne change pas)

### `package.json`

Ajout en `dependencies` : `typeorm` (explicite, actuellement transitif via `@nestjs/typeorm`) et `dotenv` (explicite, actuellement transitif via `@nestjs/config`).

Scripts ajoutés :
```json
"typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
"migration:generate": "npm run typeorm -- migration:generate",
"migration:run": "npm run typeorm -- migration:run",
"migration:revert": "npm run typeorm -- migration:revert",
"migration:show": "npm run typeorm -- migration:show"
```

## Flux de démarrage

1. `docker compose down -v && docker compose up -d` — Postgres reparti vide.
2. `npm run migration:generate -- src/database/migrations/InitSchema` — génère la migration initiale par diff entre l'entité `User` et la base vide (CREATE TABLE `user`).
3. `npm run migration:run` (une fois, en local, pour valider que la migration s'applique proprement) puis commit du fichier de migration généré.
4. À chaque démarrage suivant (`npm run start:dev`, `npm run start:prod`) : `TypeOrmModule.forRoot` établit la connexion, puis `migrationsRun: true` applique les migrations en attente avant que Nest ne commence à écouter. S'il n'y a rien en attente, l'étape est un no-op.

## Gestion des erreurs

Si une migration échoue au démarrage (DB inaccessible, conflit de schéma, migration invalide), le bootstrap Nest échoue et l'erreur TypeORM est visible directement dans les logs — comportement voulu (fail-fast), pas de démarrage silencieux avec un schéma incohérent.

## Vérification

- Reset du volume Docker, puis `npm run start:dev` : vérifier dans les logs que la migration s'applique sans erreur.
- `docker exec -it postgres-db psql -U admin -d mydatabase -c "\dt"` et `-c "\d user"` : confirmer que la table `user` existe avec les bonnes colonnes.
- `POST /auth/register` puis `POST /auth/login` : confirmer que le flux applicatif fonctionne toujours sur la base migrée.
- Relancer `npm run start:dev` une deuxième fois : confirmer qu'aucune migration n'est rejouée (idempotence).

## Documentation

Le README (section "Base de données") est mis à jour pour remplacer la mention `synchronize: true` par le nouveau workflow : démarrage Docker, génération/exécution des migrations, et note sur le fait que la base démarre vide (premier compte via `/auth/register`).
