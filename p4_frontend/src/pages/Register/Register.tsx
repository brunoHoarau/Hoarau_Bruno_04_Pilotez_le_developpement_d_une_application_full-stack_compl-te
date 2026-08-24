import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import Field from "../../components/Field/Field";
import { DivLink, RegisterBox, RegisterContainer, RegisterForm} from "./Register.styles";
import { useState } from "react";
import { createUser } from "./RegisterFunction";


function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Email
        if (!email.trim()) {
        newErrors.email = "L'email est obligatoire.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Veuillez saisir une adresse email valide.";
        }

        // Mot de passe
        if (!password) {
        newErrors.password = "Le mot de passe est obligatoire.";
        } else if (password.length < 8) {
        newErrors.password =
            "Le mot de passe doit contenir au moins 8 caractères.";
        }

        // Confirmation
        if (!passwordConfirmation) {
        newErrors.passwordConfirmation =
            "Le mot de passe est obligatoire.";
        } else if (password !== passwordConfirmation) {
        newErrors.passwordConfirmation =
            "Les mots de passe ne correspondent pas.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
        return;
        }

        try {
            const user = await createUser(email, password);

            console.log("Utilisateur créé :", user);

        } catch (error: any) {
            if (error.status === 409) {
                console.log(error)
            setErrors({
                email: error.message,
            });

            return;
            }

            console.error("Erreur lors de l'inscription :", error);
        }

    };

    return(
        <RegisterContainer>
            <RegisterBox>
                <h2>Créer un compte</h2>
                <RegisterForm id="register-form" onSubmit={handleSubmit}>
                    <Field 
                        label="Email" 
                        placeHolder="Saisissez votre email..."
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    <Field 
                        label="Mot de passe" 
                        placeHolder="Saisissez votre mot de passe..."
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <Field 
                        label="Vérification du mot de passe" 
                        placeHolder="Saisissez le à nouveau"
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        error={errors.passwordConfirmation}
                    />
                </RegisterForm>
                    <DivLink><Link to="/login">J'ai déjà un compte</Link></DivLink>
                    <Button text="Créer mon compte" type="submit" form="register-form"/>
            </RegisterBox>
        </RegisterContainer>
    )
    
}

export default Register;