import { useEffect, useState } from "react";
import { useAuth } from "../../routes/AuthContext";
import { HomeContainer, TeleverseBackground, TeleverseContainer, TeleverseImg } from "./Home.styles";
import { useNavigate } from "react-router-dom";


function Home(){

    const { checkAuth } = useAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
            const check = async () => {
                const result = await checkAuth();
    
                setAuthenticated(result);
            };
    
            check();
        }, []);

    const handleClickUpload = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // if(authenticated === true){
        //     console.log(true)
        // }else{
        //     navigate('/upload');
        // }  
        navigate('/upload');
        
            ;

    };


    return(
        <HomeContainer>
            <span className="x-large">Tu veux partager un fichier ?</span>
            <TeleverseContainer>
                <TeleverseBackground onClick={handleClickUpload}>
                    <TeleverseImg  src="./Upload.png" />
                </TeleverseBackground>
            </TeleverseContainer>
        </HomeContainer>

    )
}   

export default Home;