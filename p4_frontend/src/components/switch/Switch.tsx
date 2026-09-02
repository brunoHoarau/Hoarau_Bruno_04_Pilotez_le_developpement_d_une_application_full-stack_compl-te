import { useState, type ReactEventHandler } from "react";
import { SwitchContainer, SwitchPanel } from "./Switch.styles";

type SwitchProps = {
    value: string,
    onChange: (value: string) => void,
}


function Switch({ value, onChange }: SwitchProps){
 const options = ["Tous", "Actif", "Expiré"];

    return (
        <SwitchContainer>
            {options.map((option) => (
                <SwitchPanel
                    key={option}
                    $active={value === option}
                    onClick={() => onChange(option)}
                >
                    {option}
                </SwitchPanel>
            ))}
        </SwitchContainer>
    );
}

export default Switch;