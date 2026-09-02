import styled from "styled-components";

export const MySpaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    background-color: #FFF7F7;
    flex: 1;    

`;

export const MySpaceHeader = styled.div`
    display: flex;
`;

export const MySpaceNav = styled.div`
    width: stretch;
    height: 32px;
    background: #FFC19129;
    border-radius: 24px;
    border-width: 1px;
    overflow: hidden;
`;

export const MySpaceList = styled.div`
    display:flex;
    flex-direction: column;
    height: stretch;
    gap: 24px;

`;

export const MySpaceListEl = styled.div<{ disabled?: boolean }>`
    display:flex;
    width: stretch;
    
    justify-content: space-between;
    align-items: center;
    background-color: #FFC1910D;
    border-radius: 8px;
    border-width: 1px;
    padding-top: 8px;
    padding-right: 16px;
    padding-bottom: 8px;
    padding-left: 16px;
    border: 1px solid #D7630B33;
    gap:16px;

    & .list-file-details {
        display: flex;
        flex-direction: column;
        width: stretch;
        min-width: 40%;
        max-width: 60%;
        text-align: left;


        & .file-details{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
`;

export const ListBtns = styled.div<{ $options: boolean}>`

    display: flex;

    width: ${({ $options }) => ($options ? "stretch" : "0px")};
    opacity: ${({ $options }) => ($options ? 1 : 0)};
    visibility: ${({ $options }) => ($options ? "visible" : "hidden")};
    transform: ${({ $options }) =>
        $options ? "translateX(0)" : "translateX(10px)"};

    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease;

    pointer-events: ${({ $options }) =>
        $options ? "auto" : "none"};


    @media (max-width: 992px) {
        & .txt-delete, .txt-access{
            display: none;
        } 
    }
    
`;
