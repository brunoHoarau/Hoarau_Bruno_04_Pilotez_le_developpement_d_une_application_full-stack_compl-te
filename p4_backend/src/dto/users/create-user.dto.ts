import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Veuillez saisir une adresse email valide.' })
  @IsNotEmpty({ message: "L'email est obligatoire." })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  role?: string; // Rôle par défaut : "user"
}