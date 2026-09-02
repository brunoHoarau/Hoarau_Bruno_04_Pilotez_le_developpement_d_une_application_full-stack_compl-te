import { SelectContainer, SelectField } from "./Select.styles"

type OptionType = {
    value: string;
    label: string;
};

type FieldProps = {
    options?: OptionType[];
    label?: string,
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    error?: string;
    classCss?: string;
    defaultselected: string;
    value: string
};

function Field({label, onChange, error, classCss, options,defaultselected, value}: FieldProps){

    return(
        <SelectContainer>
            {label && (<label>{label}</label>)}
            <SelectField value={value} classCss={classCss} onChange={onChange} >
                {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
            </SelectField>
            {error && <span>{error}</span>}
        </SelectContainer>

    )
}

export default Field;