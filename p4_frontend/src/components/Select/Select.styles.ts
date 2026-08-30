import styled from "styled-components";


export const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: stretch;
    margin: 0 0 0.5rem;
    
    & label{
    
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0%;
        margin-bottom: 5px
    }

    & span{
        color: red;
        font-size: 14px;
    }

    `;

export const SelectField = styled.select<{classCss?: string}>`
    width: stretch;
    align-items:center;
    padding: 12px;
    border-radius: 8px;
    min-width: 240px;
    opacity: 1;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;

`;