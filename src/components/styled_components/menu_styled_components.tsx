import styled from 'styled-components';

const MenuScreen = styled.div`
    height:100%;
    width: 100%;
    max-width:310px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color: black;
`;

const MenuItemList = styled.div`
    display:inherit;
    flex-direction:inherit;
    align-items:inherit;
    justify-content:inherit;
    width: 100%;
    height: 50%;
`;

const MenuItem = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 16px 4px 16px;
    border: 1px solid white;
    color: white;
    margin: 10px 0;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.5rem;
    transition: 0.25s;
    position: relative;
    cursor: pointer;
    label, span{
        transition: 0.25s;
        cursor: pointer;
    } 
    span{
        margin-left: 0.1em;
    }
    :hover{
        box-shadow: inset 254px 0 0 0 white;
        color: black;
    }
    :hover span{
        margin-left: 0.3em;
        transform: rotate(15deg);
    }
    :active{
        box-shadow: inset 254px 0 0 0 white;
        color: black;
        transform: scale(1.5);
    }
`;

const MenuItemContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    max-width: 100px;
    cursor: pointer;
`;

const Title = styled.div`
    width:90%;
    font-size:3em;
    color:white;
    text-align: center;
    cursor: default;
`;

const SubTitle = styled.div`
    width:90%;
    font-size:1.5em;
    color:white;
    text-align: center;
    cursor: default;
`;

export { MenuScreen, MenuItemList, Title, MenuItemContent, MenuItem, SubTitle };