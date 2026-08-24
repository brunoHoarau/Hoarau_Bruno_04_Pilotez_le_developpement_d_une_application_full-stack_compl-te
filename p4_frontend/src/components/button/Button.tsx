import { ButtonContainer } from "./Button.styles";

type ButtonProps = {
  text: string;
  image?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  form?: string;
};

function Button({text, image, onClick, type, form}: ButtonProps){


    return (
    <ButtonContainer className="custom-button" type={type} onClick={onClick} form={form}>
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