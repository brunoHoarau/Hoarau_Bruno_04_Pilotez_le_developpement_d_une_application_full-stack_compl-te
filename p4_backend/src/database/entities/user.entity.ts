import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // Décorateur pour indiquer que cette classe est une entité TypeORM
export class User {
  @PrimaryGeneratedColumn() // Clé primaire auto-incrémentée
  id?: number;

  @Column({ unique: true }) // L'email doit être unique
  email?: string;

  @Column() // Mot de passe haché (ne jamais stocker en clair !)
  password?: string;

  @Column({default: 'John Doe'}) // Nom de l'utilisateur
  name?: string;

  @CreateDateColumn() // Date de création automatique
  createdAt?: Date;

  @UpdateDateColumn() // Date de mise à jour automatique
  updatedAt?: Date;
}