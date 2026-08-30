# P4 Backend

API backend construite avec [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) et [PostgreSQL](https://www.postgresql.org/), fournissant l'inscription, l'authentification (JWT) et la gestion des utilisateurs.

## Stack technique

- **NestJS 11** (Express)
- **TypeORM** + **PostgreSQL** (`pg`)
- **Passport JWT** (`@nestjs/passport`, `passport-jwt`) pour l'authentification
- **class-validator** pour la validation des DTO
- **bcrypt** pour le hachage des mots de passe
- **Jest** pour les tests

## Prérequis

- [Node.js](https://nodejs.org/) 18+ et npm
- [Docker](https://www.docker.com/) + Docker Compose (pour PostgreSQL)
- Git

## Démarrage rapide (depuis un `git clone`)

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd <nom-du-dossier>/p4_backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# éditer .env si besoin (voir section Configuration)

# 4. Démarrer PostgreSQL (docker-compose.yml à la racine du dépôt, au-dessus de p4_backend)
docker compose -f ../docker-compose.yml up -d

# 5. Lancer l'API en mode développement (les migrations s'appliquent automatiquement au démarrage)
npm run start:dev

# 6. Créer un compte (la base démarre vide)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123","name":"You"}'
```

L'API est alors disponible sur `http://localhost:3000`.

## Configuration

Les variables d'environnement sont chargées depuis un fichier `.env` (non versionné). Un modèle est fourni dans `.env.example` :

```env
DATABASE_URL="postgresql://admin:secret123@localhost:5432/mydatabase"
JWT_SECRET=change_this_dev_secret
NODE_ENV=development
PORT=3000
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL, doit correspondre aux identifiants de `docker-compose.yml` |
| `JWT_SECRET` | Secret utilisé pour signer/vérifier les tokens JWT |
| `NODE_ENV` | Environnement (`development` ou `production`) |
| `PORT` | Port d'écoute de l'API (défaut `3000`) |

## Base de données

Le `docker-compose.yml` (à la racine du dépôt) démarre PostgreSQL et pgAdmin :

```bash
docker compose -f ../docker-compose.yml up -d
```

- PostgreSQL : `localhost:5432` (db `mydatabase`, user `admin`, password `secret123`)
- pgAdmin : http://localhost:5050 (`admin@example.com` / `admin123`)

Le schéma est géré par des migrations TypeORM versionnées (`src/database/migrations/`), appliquées automatiquement au démarrage de l'application (`migrationsRun: true`) — `synchronize` est désactivé, y compris en développement.

La base démarre **vide** : il n'y a pas de compte pré-créé. Le premier utilisateur crée son compte via `POST /auth/register`.

Commandes disponibles pour gérer les migrations :

```bash
npm run migration:generate -- src/database/migrations/<NomDeLaMigration>  # génère une migration depuis les entités
npm run migration:run                                                     # applique les migrations en attente
npm run migration:revert                                                  # annule la dernière migration appliquée
```

## Scripts disponibles

```bash
npm run start          # démarrage simple
npm run start:dev      # démarrage en mode watch (recommandé en dev)
npm run start:debug    # démarrage avec debugger + watch
npm run build           # compilation TypeScript -> dist/
npm run start:prod      # exécute le build compilé (dist/main.js)

npm run test            # tests unitaires
npm run test:watch      # tests unitaires en mode watch
npm run test:cov        # couverture de tests
npm run test:e2e        # tests end-to-end

npm run lint            # ESLint (--fix)
npm run format          # Prettier sur src/ et test/
```

## Routes de l'API

Aucun préfixe global n'est configuré : les routes sont exposées telles que listées ci-dessous.

### Auth (`/auth`)

| Méthode | Route | Auth | Body |
|---|---|---|---|
| POST | `/auth/register` | non | `RegisterDto` (`email`, `password` ≥ 8 car., `name`, `role?`) |
| POST | `/auth/login` | non | `LoginDto` (`email`, `password`) |
| POST | `/auth/logout` | non | — |

`POST /auth/login` ne renvoie pas le token dans le corps de la réponse : il pose un cookie **httpOnly** `access_token` (`sameSite: lax`, expire après 1h) et renvoie `{ message: 'Connexion réussie' }`. Les routes protégées lisent ce cookie via `JwtStrategy` — il n'y a pas de support du header `Authorization: Bearer <token>`.
`POST /auth/logout` efface le cookie `access_token` (`res.clearCookie`, mêmes options `httpOnly`/`sameSite: lax`/`path: '/'`) et renvoie `{ message: 'Déconnexion réussie' }`.

### Users (`/users`)

| Méthode | Route | Auth | Body / Params |
|---|---|---|---|
| POST | `/users` | non | `CreateUserDto` |
| GET | `/users/:id` | JWT | `id` |
| PUT | `/users/:id` | JWT | `id` + `UpdateUserDto` |
| DELETE | `/users/:id` | JWT | `id` |

### Exemples curl

Le token étant posé dans un cookie httpOnly, il faut demander à `curl` de le conserver (`-c`) puis de le renvoyer (`-b`) pour appeler une route protégée :

```bash
# Inscription
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'

# Connexion — sauvegarde le cookie access_token dans cookies.txt
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Route protégée — renvoie le cookie sauvegardé
curl -b cookies.txt http://localhost:3000/users/1
```

## Points d'attention connus

- **`GET/PUT/DELETE /users/:id` ne sont pas implémentés** : `UsersService.findOneById`, `update` et `remove` lèvent actuellement `Error('Method not implemented.')`.
- **Validation des DTO non activée globalement** : aucun `app.useGlobalPipes(new ValidationPipe())` n'est présent dans `main.ts`, donc les décorateurs `class-validator` des DTO ne sont pas appliqués tant que ce pipe n'est pas enregistré.
- `POST /users` et `POST /auth/register` font tous les deux de la création de compte sans authentification — à clarifier si un seul doit rester le point d'entrée d'inscription.

## Structure du projet

```
src/
├── common/
│   ├── filters/          # HttpExceptionFilter
│   └── guards/           # JwtAuthGuard
├── controllers/          # AuthController, UsersController
├── database/
│   ├── data-source.ts     # DataSource TypeORM partagée (CLI + app)
│   ├── entities/          # User
│   └── migrations/        # Migrations versionnées
├── dto/
│   ├── auth/              # RegisterDto, LoginDto
│   └── users/             # CreateUserDto, UpdateUserDto
├── services/              # AuthService, UsersService
├── strategies/            # JwtStrategy
├── app.module.ts
└── main.ts
```

## Licence

UNLICENSED (projet privé).
