import styled from "styled-components";

const AboutPage = styled.div`
    height: 100%;
    width: 100%;
    max-width: 310px;
    display: grid;
    grid-template-rows: 100px 30px auto 100px;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
`;

const AboutParagraph = styled.div`
    width: 100%;
    max-height: calc(100%);
    overflow-y: auto;
    padding: 5px 0;
    margin: 5px 0;
    color: white;
    font-size: 1.5rem;
`;

export { AboutPage, AboutParagraph };