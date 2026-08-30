import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Field from "../../components/Input/Input";
import { DivErrors, DivLink, LoginBox, LoginContainer, LoginForm} from "./Login.styles";
import { useState } from "react";
import { login } from "../../api/LoginFunction";
import { useAuth } from "../../routes/AuthContext";


function Login() {
    const { setAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        message?: string;
    }>({});

    const navigate = useNavigate();

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
            newErrors.password = "Veuillez saisir votre mot de passe.";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(!validateForm()){ return}
        try {
            const response = await login(email,password);

            // redirection
            if (response) {
                setAuthenticated(true);
                navigate('/myspace');
            }
        }catch (error) {
            setErrors((prev) => ({
                ...prev,
                message: error instanceof Error ? error.message : 'Erreur de connexion',
            }));
       
            console.log(errors.message ? errors.message : "" )
        }


    }

    return(
        <LoginContainer>
            <LoginBox>
                <h2>Connexion</h2>
                <LoginForm id="login-form" onSubmit={handleSubmit}>
                    <Field 
                        label="Email" 
                        placeHolder="Saisissez votre email..."
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        />
                    <Field 
                        label="Mot de passe" 
                        placeHolder="Saisissez votre mot de passe..."
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                </LoginForm>
                    { errors.message && <DivErrors>{errors.message}</DivErrors> }
                    <DivLink><Link to="/register">Créer un compte</Link></DivLink>
                    <Button text="Connexion" type="submit" form="login-form" />
            </LoginBox>
        </LoginContainer>
    )
    
}

export default Login;