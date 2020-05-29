import styled from 'styled-components';
import InputElement from "react-input-mask";

export const Main = styled.div`
    background: #00bcd4;
    padding: 20px;
    font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
`;

export const Table = styled.table`
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-color: #008ba3;
    border-collapse: collapse;
    background: #62efff;
`;

export const Td = styled.td`
    padding: 10px 20px;
    border-style: solid;
    border-color: #008ba3;
    border-width: 0 1px 1px 0;
`;

export const Button = styled.button`
    text-decoration: none;
    outline: none;
    display: inline-block;
    padding: 10px 30px;
    position: relative;
    overflow: hidden;
    border: 1px solid #008ba3;
    border-radius: 8px;  
    :hover {
        background: #62eeff;
    }
`;

export const PaginationButton = styled(Button)`
    padding: 3px 5px;
    margin: 0;
`;

export const List = styled.ul`
    list-style: none;
    height: 180px;
`;

export const Input = styled.input`
    display: block;
    width: 200px;
    padding: 0 20px;
    margin-bottom: 10px;
    background: #E9EFF6;
    line-height: 40px;
    border-width: 0;
    border-radius: 20px;
`;

export const InputElementStyled = styled(InputElement)`
    display: block;
    width: 120px;
    padding: 0 20px;
    margin-bottom: 10px;
    background: #E9EFF6;
    line-height: 40px;
    border-width: 0;
    border-radius: 20px;
`;

export const Select = styled.select`
    display: block;
    width: 120px;
    padding: 0 20px;
    margin-bottom: 10px;
    background: #E9EFF6;
    line-height: 40px;
    border-width: 0;
    border-radius: 20px;
`;

export const TableButton = styled.button`
    background: #62efff;
    border-style: none;
    
    :hover {
        color: #008ba3;
    }
`;

export const Image = styled.img`
    height: 200px;
    width: 200px;
    border: 1px solid #008ba3;
    border-radius: 8px;  
`;

export const MiniImage = styled(Image)`
    height: 100px;
    width: 100px;
`;

export const NoImage = styled.div`
    display: inline-block;
    height: 100px;
    width: 100px;
    padding: 0;
    border: 1px solid #008ba3;
    border-radius: 8px;  
`;