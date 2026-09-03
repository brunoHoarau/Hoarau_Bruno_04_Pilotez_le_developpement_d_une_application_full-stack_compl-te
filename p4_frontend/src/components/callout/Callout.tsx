import { use, useEffect, useState } from "react";
import { CalloutContainer } from "./Callout.styles";

interface CalloutProps {
    expiresAt?: string | null ;
}
function Callout({expiresAt}: CalloutProps ){

    console.log(expiresAt);
    const now = Date.now();
    const expireAtMs = new Date(expiresAt!).getTime();
    const calcul = expireAtMs - now;

    const j = Math.floor(
        calcul / (1000 * 60 * 60 * 24)
    );

    const h = Math.floor(
        (calcul % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const mn = Math.floor(
        (calcul % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    // console.log("calcul :", calcul);
    // console.log("jours :", j);
    // console.log("heures :", h);
    // console.log("minutes :", mn);

    const CalloutContains = () => {
        if (j >= 3) {
            return (
                <>
                    <img src="/Info.svg" />
                    <div>
                        Ce fichier expirera dans {j} jours.
                    </div>
                </>
            );
        }

        if (h > 0) {
            return (
                <>
                    <img src="/Alert-triangle.svg" />
                    <div>
                        Ce fichier expirera dans {h} heure{h > 1 ? "s" : ""}.
                    </div>
                </>
            );
        }

        if (mn > 0) {
            return (
                <>
                    <img src="/Alert-octagon.svg" />
                    <div>
                        Ce fichier expirera dans {mn} minute{mn > 1 ? "s" : ""}.
                    </div>
                </>
            );
        }

        return (
            <>
                <img src="/Alert-octagon.svg" />
                <div>
                    Ce fichier n'est plus disponible en téléchargement
                    car il a expiré.
                </div>
            </>
        );
    };

    const classCss =
    j >= 3
        ? "info"
        : h > 0
            ? "alert"
            : "danger";

    return(
        <CalloutContainer className={"callout "+ classCss}>
            <CalloutContains />
        </CalloutContainer>
    )
}

export default Callout;