
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { UploadForm, UploadField } from "./Upload.styles";
import { uploadFile } from "../../api/UploadFunction";
import { formaterTaille } from "../../utils/files.utils";

function Upload () {
    const [valid,setValid] = useState(false)
    const [file, setFile] = useState(false)
    const [fileSize, setFileSize] = useState('')
    const [password, setPassword] = useState('')
    const [expirationDays,setExpirationDays] = useState("7")
    const [errors, setErrors] = useState<{
        file?: string;
        password?: string;
    }>({});

    const options = [
        { value: '1', label: 'Une journée'},
        { value: '2', label: 'Deux journées'},
        { value: '3', label: 'Trois journées'},
        { value: '4', label: 'Quatre journées'},
        { value: '5', label: 'Cinq journées'},
        { value: '6', label: 'Six journées'},
        { value: '7', label: 'Sept journées'},
    ];

    const validUploadForm = () =>{
         const newErrors: typeof errors = {};

         if (!file){
            newErrors.file = "Selectionnez un fichier";
             setErrors(newErrors);
             return;
        } 

        if(password){   
            if(password.length > 0 && password.length < 6){
                newErrors.password = "6 caractères minimum";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleUploadOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileSize("");
        const newErrors: typeof errors = {};
        const fileUpload = e.target.files?.[0];

        if (!fileUpload){
            newErrors.file = "Selectionnez un fichier";
             setErrors(newErrors);
             return;
        } else {
            newErrors.file = "";
            const size = formaterTaille(fileUpload.size)
            setFileSize(size)
            setFile(true)
            setErrors(newErrors);
        }

        const maxSize = 1 * 1024 * 1024 * 1024; // 1 Go

        if (fileUpload.size >= maxSize) {
            newErrors.file = "La taille des fichiers est limitée à 1 Go.";
            if(errors.password){newErrors.password = errors.password }
            setErrors(newErrors);
            return;
        }

          // Extensions interdites
        const forbiddenExtensions = [
            ".exe",
            ".bat",
            ".cmd",
            ".com",
            ".msi",
            ".scr",
            ".pif",
            ".ps1",
            ".vbs",
            ".vbe",
            ".js",
            ".jse",
            ".jar",
            ".ws",
            ".wsf",
            ".wsc",
            ".hta",
        ];

        const extension = fileUpload.name
            .substring(fileUpload.name.lastIndexOf("."))
            .toLowerCase();

        if (forbiddenExtensions.includes(extension)) {
            newErrors.file = "Ce type de fichier n'est pas autorisé." ;
            if(errors.password){newErrors.password = errors.password }
            setErrors(newErrors);
            e.target.value = "";
            return
        }
    }

    const handleSelectExpirationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // e.preventDefault();
        setExpirationDays(e.target.value)
    }
    

    const handlePassOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if(e.target.value.length >= 6){errors.password = ""}
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
        const form = e.currentTarget;
         const btn = form.querySelector("#btn-submit-upload");
        e.preventDefault();
        let result= {};
        if(!validUploadForm()){return}
        const formData = new FormData(e.currentTarget);

        const file = formData.get("file_up");

        if (!(file instanceof File)) {
            console.error("Aucun fichier sélectionné");
            return;
        }

        try {
            result = await uploadFile(
            file,
            expirationDays.toString(),
            password,
            );

            console.log("Upload réussi :", result);
        } catch (error) {
            return;
            console.error("Erreur upload :", error);
        }

        if( result! === 201 ){
             if (btn instanceof HTMLButtonElement) {
                btn.setAttribute("disabled", "true");
            }
            setValid(true);
        }
    }


    useEffect(() =>{
        if(Object.keys(errors).length === 0){
            console.log(errors);
        }
    })

    return(
        <UploadForm id="upload-form" onSubmit={handleSubmit}>
            <h2>Ajouter un fichier</h2>
            <UploadField >
                <div> 
                    <div >
                        <input type="file" id="file_up" name="file_up" onChange={handleUploadOnchange}/>
                        { fileSize && <span>{fileSize}</span>}
                    </div>  
                    {!valid && <label className="custom-button" htmlFor="file_up" >Upload</label>}
                </div>
                    { errors.file && <div><span className="error">{errors.file}</span></div>}
            </UploadField>
            {!valid &&<Input label="Mot de passe" placeHolder="Optionnel" classCss="orange" onChange={handlePassOnchange} error={errors.password}/> }
            {!valid &&<Select label="Expiration" value={expirationDays}  options={options} defaultselected={expirationDays} onChange={handleSelectExpirationChange}/> }
            <Button 
                id="btn-submit-upload" 
                className={ errors.file || errors.password || valid ? "btn-disabled": ""} 
                text={"Téléverser"} 
                type="submit" 
                form="upload-form" 
                image="Icon.svg"  
            />
        </UploadForm>
    )
}


export default Upload;