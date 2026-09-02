import styled from "styled-components";


export const SwitchContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: stretch;
    height: 32px;
    border-radius: 24px;
    border: 1px solid #D7630B33;
    overflow: hidden;
    flex-shrink:0;
`;

export const SwitchPanel = styled.div< { $active: boolean } >`
    display: flex;
    color: ${({ $active }) => ($active ? "#fff" : "")};
    background-color: ${({ $active }) => ($active ? " #E77A6E" : "rgba(255, 193, 145, 0.16)")};
    width: stretch;
    height: stretch;
    justify-content: center;
    align-items: center;
`;