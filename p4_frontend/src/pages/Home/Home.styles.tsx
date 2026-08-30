import styled from "styled-components";


export const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100svh;

    & >span {
        margin: 1rem;
    }
`;

export const TeleverseContainer = styled.div`
    width: 144px;
    height: 144px;
    gap: 10px;
    angle: 0 deg;
    opacity: 1;
    border-radius: 240px;
    padding: 24px;
    background: #2F190D26;
    
    
`;

export const TeleverseBackground = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96px;
    height: 96px;
    gap: 10px;
    angle: 0 deg;
    opacity: 1;
    border-radius: 240px;
    padding: 24px;
    background-color: black;
    color: white;
`;

export const TeleverseImg = styled.img`
    height: 48px;
    width: 48px;
`;