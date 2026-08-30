import styled from "styled-components";


export const UploadForm = styled.form`
    @media (min-width: 992px) {
        max-width: 640px 
    }
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0; 
    width: stretch;
    background-color: white;
    opacity: 1;
    gap: 24px;
    padding: 24px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0px 0px 12px 0px #00000040;

    &  input, select {
        border: var(--input-border-default)
    }
    
    & input[type="file"]{ 
        border: none;
        width: 80%;
        margin-left: 16px;     
        }
    & input[type="file"]::file-selector-button {
        display: none;
    }

`;

export const UploadField = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 56px;
    opacity: 1;

    & div > label{
        width: fit-content;
    }
    
    & div {
        display: flex;
        align-items: center;
    }
    
    & div > div{
        flex-direction: column;
        justify-content: start;
        align-items: baseline;
    }

`;