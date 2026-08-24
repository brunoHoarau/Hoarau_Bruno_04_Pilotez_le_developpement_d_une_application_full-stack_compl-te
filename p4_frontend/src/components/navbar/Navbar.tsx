import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { NavbarContainer } from "./Navbar.styles";


function Navbar(){

    const navigate = useNavigate();

    const handleGoToConnect = () => {
        navigate("/login");
    }


    return(
        <NavbarContainer>
            <h1>DataShare</h1>
             {location.pathname !== "/login" && (
                <Button 
                    text="Se connecter" 
                    onClick={handleGoToConnect} 
                />
            )}
        </NavbarContainer>
    )
}

export default Navbar;