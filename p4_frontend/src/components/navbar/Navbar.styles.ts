import styled from "styled-components";


export const NavbarContainer = styled.nav`
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;
    margin: 0 16px;
    width: stretch;
    max-width: 1280px;

    & h1{  
        font-weight: 700;
        font-style: Bold;
        font-size: Static/Headline Large/Size;
    }

    & button{
        max-width: 125px;
        height:40px;
        background-color: black;
        color: white;
        width: 123;
        border: none;

    }
`;