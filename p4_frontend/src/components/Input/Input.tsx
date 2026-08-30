import { InputContainer, InputField } from "./Input.styles"

type FieldProps = {
    label?: string,
    placeHolder?: string
    type?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    classCss?: string;
};

function Input({label, placeHolder, type, onChange, error, classCss}: FieldProps){

    return(
        <InputContainer>
            {label && (<label>{label}</label>)}
            <InputField className={classCss} placeholder={placeHolder} type={type} onChange={onChange} />
            {error && <span>{error}</span>}
        </InputContainer>

    )
}

export default Input;