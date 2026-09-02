import { useLocation, useParams } from "react-router-dom";
import { formaterTaille } from "../../utils/files.utils";
import { useEffect, useState, type FormEvent } from "react";
import { OneFile } from "../../api/OneFile";
import { DownloadContainer, DownloadForm } from "./Download.styles";
import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import { downloadFile } from "../../api/DownloadFile";
import Callout from "../../components/callout/Callout";

interface DownloadState {
    fileToken?: string;
    fileSize?: string;
    fileName?: string;
    filePassword?: boolean;
    fileTimeRemaining?: string | number;
    fileExpiresAt?: string;
}

function Download() {
    const { token } = useParams();
    const location = useLocation();
    const [password, setPassword] = useState('')
    const [ calloutMsg, setCalloutMsg] = useState('')
    const [valid, setValid] = useState(false)
    const { 
        fileToken: initialFileToken, 
        fileSize: initialFileSize, 
        fileName: initialFileName,
        filePassword: initialPassword,
        fileTimeRemaining: initialTimeRemaining,
        fileExpiresAt: initialExpiresAt
    } =  (location.state as DownloadState | null) ?? {};

    const [file, setFile] = useState({
        token: initialFileToken ?? null,
        size: initialFileSize ?? null,
        name: initialFileName ?? null,
        password: initialPassword ?? null,
        timeRemaining: initialTimeRemaining ?? null,
        delete: false,
        expiresAt: initialExpiresAt
    });

    const [errors, setErrors] = useState<{
        file?: string;
        password?: string;
    }>({});

    const handlePassOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if(e.target.value.length >= 6){errors.password = ""}
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
        const form = e.currentTarget;
        const btn = form.querySelector("#btn-submit-download");
        e.preventDefault();
        let result= {};

         if (!file.token) {
            return;
        }

        try {
            const blob = await downloadFile(
                file.token,
                password,
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name!;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            return;
        }

        if( result! === 200 ){
                if (btn instanceof HTMLButtonElement) {
                btn.setAttribute("disabled", "true");
            }
            setValid(true);
        }
    }

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
                        password: info.requiresPassword,
                        delete: info.physicalDeletedAt,
                        timeRemaining: info.timeRemaining,
                        expiresAt: info.expiresAt
                    });

                } catch(error: any){
                    if(error.status === 410){
                        setCalloutMsg(error.message)
                    }
                }
            };

            console.log(file)
            dataInfo()
        
    }, [token, file.token, file.timeRemaining])

    return (
        <DownloadContainer>
            <DownloadForm id="download-form" onSubmit={handleSubmit}>
                <div>
                    <h2>Telecharger un fichier</h2>
                </div>
                
                {file.timeRemaining && <div className="dflex gap16">
                    <div>
                        <img src="../Picture.svg" alt="img description" />
                    </div>
                    <div className="dflex flex-d-c ">
                        <span className="file-details-name">{file.name}</span>
                        <span>{file.size}</span>
                    </div>
                </div>
                }
                {file.timeRemaining && <Callout timeRemaining={file.timeRemaining} expiresAt={file.expiresAt ?? null} /> }
                {file.password && 
                <div>
                    <Input label="Mot de passe" placeHolder="Optionnel" classCss="orange" onChange={handlePassOnchange} error={errors.password}/>
                </div>
                }
                {file.timeRemaining && <Button 
                    id="btn-submit-download" 
                    className={ errors.file || errors.password ? "btn-disabled": ""} 
                    text={"Télécharger"} 
                    type="submit" 
                    form="download-form" 
                    image="/Icon.svg"  
                />}
            </DownloadForm>
        </DownloadContainer>
    )
}

export default Download;