import { useEffect, useState } from "react";
import { AllFilesByUSer } from "../../api/AllFilesByUser";
import { MySpaceContainer, MySpaceList, MySpaceHeader, MySpaceNav, MySpaceListEl, ListBtns, } from "./MySpace.styles";
import { Link, useNavigate } from "react-router-dom";
import { formaterTaille} from "../../utils/files.utils";
import Switch from "../../components/switch/Switch";
import { deleteFile } from "../../api/DeleteFile";

interface UserFile {
    id: string;
    expiresAt: string;
    size: number;
    originalName: string;
    mimetype: string;
    token: string;
    timeRemaining: string;
    requiresPassword: boolean;
    physicalDeletedAt: string | null;
}

function MySpace()  {

    const [ data, setData]= useState<UserFile[]>([]);
    const [filter, setFilter] = useState("Tous");
    const [options, setOptions] =  useState<string | null>(null);;

    const navigate = useNavigate();

    const filteredData = data?.filter((file) => {
        if (filter === "Tous") {
            return true;
        }

        if (filter === "Actif") {
            return !file.physicalDeletedAt;
        }

        if (filter === "Expiré") {
            return !!file.physicalDeletedAt;
        }

        return true;
    });

    const handleClickOption = (
        e: React.MouseEvent<HTMLImageElement>,
        fileId: string
    ) => {
        e.stopPropagation();
        e.preventDefault();

        setOptions((current) => current === fileId ? null : fileId);

    }

    const handleAccess = (
        e: React.MouseEvent<HTMLDivElement>,
        file: UserFile
    ) => {
        e.stopPropagation();

        if (file.physicalDeletedAt) {
            return;
        }

        navigate("/download/", {
            state: {
                fileToken: file.token,
                fileName: file.originalName,
                fileSize: formaterTaille(file.size),
                filePassword: file.requiresPassword,
                fileTimeRemaining: file.timeRemaining,
                fileExpiresAt: file.expiresAt
            },
        });

        setOptions(null);
    };

    const handleDelete =  async(
        e: React.MouseEvent<HTMLDivElement>,
        token: string
    ) =>{
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm(
            "Êtes-vous sûr de vouloir supprimer définitivement ce fichier ? Cette action est irréversible."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteFile(token);

            setData((currentData) =>
                currentData.filter((file) => file.token !== token)
            );
            } catch (error: any) {
                console.error(error.message);
            }
        }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datum = await AllFilesByUSer();
                setData(datum);
            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        if (options === null) return;

        const handleClickOutside = () => {
            setOptions(null);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [options]);


    return(
        <MySpaceContainer>
            <MySpaceHeader>
                <h2>Mes fichiers</h2>
            </MySpaceHeader>
            <Switch value={filter} onChange={setFilter}/>
            <MySpaceList>
                {filteredData.map((file)=>{

                    const isOptionsOpen = options === file.id;
                    return (
                            <MySpaceListEl
                                key={file.id} 
                                disabled={!file.physicalDeletedAt}
                                onBlur={(e) => {
                                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                        setOptions(null);
                                    }
                                }}
                                >
                                <div>
                                    <img src="./Picture.svg" />
                                </div>
                                <div className="list-file-details">
                                    <span className="file-details-name">{file.originalName}</span>
                                    <span className="file-details">{file.timeRemaining}</span>
                                </div>
                                <div className={!isOptionsOpen ? "dflex" : "dnone"} >
                                    {file.requiresPassword && <img src="./Lock.svg" />}
                                </div>
                                <div className="file-actions dflex">
                                    <div className={!isOptionsOpen ? "dflex" : "dnone"}>
                                        {!file.physicalDeletedAt && (
                                            <div className="btn-icon-dot">
                                                <img
                                                    className="icon-dot"
                                                    src="./3dot.svg"
                                                    onClick={(e) => handleClickOption(e, file.id)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <ListBtns  
                                        className={isOptionsOpen ? "dflex" : "dnone"} 
                                        $options={isOptionsOpen}
                                        onClick={(e) => handleDelete(e, file.token)}
                                    >
                                        <div className="btn-icon">
                                            <img className="img-delete" src="./Trash.svg" />
                                            <div className="txt-delete">Supprimer</div>
                                        </div>

                                        <div
                                            className="btn-icon"
                                            onClick={(e) => handleAccess(e, file)}
                                        >
                                            <img className="img-access" src="./Arrow-r.svg" />
                                            <div className="txt-access">Accéder</div>
                                        </div>
                                    </ListBtns>
                                </div>
                            </MySpaceListEl>
                    )
                    })
                }
            </MySpaceList>

        </MySpaceContainer>
    )
}

export default MySpace;