import styled from "styled-components";


export const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100svh;
`;
export const LoginBox= styled.div`
    @media (min-width: 992px) {
        width: stretch;
        max-width: 640px 
    }
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    gap: 24px;
    angle: 0 deg;
    opacity: 1;

    & button{
        color: var(--txt-color);
        border: var(--btn-border);
        background-color: var(--btn-background-color);

    }
`;

export const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 24px 0px 24px;

    & input{
        border: var(--input-border-default)
    }
`;

export const DivLink = styled.div`
    color: var(--link-color);
    padding: 12px;
`;

export const DivErrors = styled.div`
    Color: red;
    font-weight: 700;
    letter-spacing: 0.05rem;
`;