import { FieldContainer, FieldInput } from "./Field.styles"

type FieldProps = {
    label?: string,
    placeHolder?: string
    type?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
}

function Field({label, placeHolder, type, onChange, error}: FieldProps){

return(
    <FieldContainer>
        {label && (<label>{label}</label>)}
        <FieldInput placeholder={placeHolder} type={type} onChange={onChange}/>
        {error && <span>{error}</span>}
    </FieldContainer>

)

}

export default Field;