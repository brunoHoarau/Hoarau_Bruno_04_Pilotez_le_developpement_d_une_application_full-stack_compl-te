import { HomeContainer, TeleverseBackground, TeleverseContainer, TeleverseImg } from "./Home.styles";


function Home(){

    return(
        <HomeContainer>
            <span className="x-large">Tu veux partager un fichier ?</span>
            <TeleverseContainer>
                <TeleverseBackground>
                    <TeleverseImg  src="./Upload.png" />
                </TeleverseBackground>
            </TeleverseContainer>
        </HomeContainer>

    )
}   

export default Home;