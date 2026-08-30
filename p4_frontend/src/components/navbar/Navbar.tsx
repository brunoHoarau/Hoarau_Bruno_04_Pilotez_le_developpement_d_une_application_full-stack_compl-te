import { Link, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { ButtonBurger, NavbarContainer, Sidebar, SidebarBody, SidebarBrand } from "./Navbar.styles";
import { useAuth } from "../../routes/AuthContext";
import { useEffect, useState } from "react";
import { logout } from "../../api/LogoutFunction";


function Navbar(){

    const { authenticated, checkAuth } = useAuth();
    const [showSidebar, setShowsidebar] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const check = async () => {
            const result = await checkAuth();
            console.log("checkAuth resut: ", result)
            
        };

        check();
    }, []);



    const handleGoToConnect = () => {
        navigate("/login");
    }
    const handleGoToMySpace = () => {
        navigate("/myspace");
    }

    const handleClickLogout = async() => {
        const logoutData = await logout();
         console.log("logout: ", logoutData.status)
         logoutData.status === 204 ? alert(logoutData.message) : "";
    }
    
    const ButtonNav = () =>{

         // On ne décide rien tant que checkAuth() n'a pas répondu
        if (authenticated === null) {
            return null;
        }

        if(!authenticated && location.pathname !== "/login"){
            return( 
                <Button  
                    text="Se connecter" 
                    onClick={handleGoToConnect} 
                /> )
        } 
        else if(authenticated && location.pathname === "/myspace" ) {
            return(
                <div id="Sidebar-right" >
                    <span>John D'ou?</span>
                    <button id="btn-logout" onClick={handleClickLogout}>
                        <img  src="./logout.svg" alt="logout"/>
                    </button>
                </div>
            )
        }
        else if(authenticated) {
            return(
                <Button 
                    text="Mon espace" 
                    onClick={handleGoToMySpace} 
                />
            )
        }
    }

    const handleClickBurger = () => {
        setShowsidebar(true)
    }
    const handleCloseBurger = () => {
        setShowsidebar(false)
    }

    return(
        <NavbarContainer>
            {(authenticated && location.pathname !== "/home")  && <ButtonBurger id="btn-burger" onClick={handleClickBurger}>
                <img src="./hamburger.svg" />
            </ButtonBurger>}

            {location.pathname !== "/home"  && <Sidebar $show={showSidebar}>
                <SidebarBrand className="sidebar-brand" >
                    <img src="./cross.svg" alt="X" onClick={handleCloseBurger} />
                    <Link to={"/home"} onClick={() => setShowsidebar(false)}>
                        <h1>DataShare</h1>
                    </Link>
                </SidebarBrand>
                <SidebarBody>
                    <Button className="btn-sidebar" text={"Mes fichier"} ></Button>
                </SidebarBody>
            </Sidebar>}

            { (location.pathname !== "/myspace" && location.pathname !== "/upload" ) && <Link to={"/home"}>
                <h1>DataShare</h1>
            </Link>}
             <ButtonNav />
             
        </NavbarContainer>
    )
}

export default Navbar;