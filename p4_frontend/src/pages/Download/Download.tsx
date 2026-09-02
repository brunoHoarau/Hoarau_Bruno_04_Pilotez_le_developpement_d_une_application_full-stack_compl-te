import { useLocation, useParams } from "react-router-dom";
import { formaterTaille } from "../../utils/files.utils";
import { useEffect, useState } from "react";
import { OneFile } from "../../api/OneFile";
import { ContainerBox, DownloadContainer } from "./Download.styles";


function Download() {
    const { token } = useParams();
    const location = useLocation();
    const { 
        fileToken: initialFileToken, 
        fileSize: initialFileSize, 
        fileName: initialFileName, 
    } = location.state ?? {};

    const [file, setFile] = useState({
        token: initialFileToken ?? null,
        size: initialFileSize ?? null,
        name: initialFileName ?? null,
    });

    useEffect( () => {
        if (file.token || !token) {
            return;
        }
        
            const dataInfo = async  ()=>{
                try{
                    const info = await OneFile(token)
                    console.log("info: ",info);
                    setFile({
                        token,
                        size: formaterTaille(info.size),
                        name: info.originalName,
                    });

                } catch(error){
                    console.log(error)
                }
            };

            dataInfo()
        
    }, [token, file.token])

    return (
        <DownloadContainer>
            <ContainerBox>
                <div>
                    <h2>Telecharger un fichier</h2>
                </div>
                <div>
                    <div>
                        <img src="../Picture.svg" alt="img description" />
                    </div>
                    <div>
                        <span>{file.name}</span>
                        <span>{file.size}</span>
                    </div>
                </div>
                <div>

                </div>
            </ContainerBox>
        </DownloadContainer>
    )
}

export default Download;