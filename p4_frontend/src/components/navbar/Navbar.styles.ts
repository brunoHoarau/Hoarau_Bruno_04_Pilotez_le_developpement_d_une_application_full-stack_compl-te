import styled from "styled-components";


export const NavbarContainer = styled.nav`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;
    padding: 24px;
    width: stretch;
    max-width: 1280px;

    & h1{  
        font-weight: 700;
        font-style: Bold;
        font-size: Static/Headline Large/Size;
    }

    & button{
        max-width: 125px;
        background-color: black;
        color: white;
        width: 123;
        border: none;

    }
`;

export const ButtonBurger = styled.button`
    @media (min-width: 992px) {
        display: none;
    }
    
`;

export const Sidebar = styled.div<{ $show: boolean}>`
    @media (min-width: 992px) {
        display: ${({ $show }) => ($show ? "block" : "none")};
    }
    display: ${({ $show }) => ($show ? "flex" : "none")};
    position: absolute;
    flex-direction: column;
    top: 0;
    left: -1rem;
    width: 295px;
    height: 100vh;
    border-right-width: 2px;
    background: linear-gradient(172.84deg, #FFB88C 2.29%, #DE6262 97.71%);
`;

export const SidebarBrand = styled.div`
    display:flex;
    align-items: center;
    height: 72px ;
    width: 295;
    padding-right: 24px;
    padding-left: 24px;
    gap: 24px;
    border-right-width: 2px;

    & img { height: 12px}
    & h1 {color: white}
`;

export const SidebarBody = styled.div` 
    gap: 10px;
    padding: 24px;
    & > button {
        background-color: #FFFFFF66;
        padding-top: 8px;
        padding-right: 16px;
        padding-bottom: 8px;
        padding-left: 16px;
        gap: 10px;
        color:#803A00;
        font-weight: 600;


    }
`;