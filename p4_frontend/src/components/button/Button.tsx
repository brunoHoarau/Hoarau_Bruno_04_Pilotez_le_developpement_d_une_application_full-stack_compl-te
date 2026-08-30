import { ButtonContainer } from "./Button.styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  text: string;
  image?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  form?: string;
  disabled?: boolean;
};

function Button({id, text, className, image, onClick, type, form, disabled}: ButtonProps){ 

    return (
    <ButtonContainer 
        id={id}
        className={"custom-button " + (className ?? "")}
        type={type} 
        onClick={onClick} 
        form={form}
        disabled={disabled}
        >
            {image && (
                <img
                src={image}
                alt={text}
                className="button-image"
                />
            )}
        <span>{text}</span>
    </ButtonContainer>
  );


}

export default Button;