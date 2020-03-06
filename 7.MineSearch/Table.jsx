import React, { useContext, memo } from 'react';
import Tr from './Tr';
import { TableContext } from './MineSearch';

const Table = memo( () => {
    const { tableData } = useContext(TableContext);  // Context API 불러오기 (구조분해)
    
    return (
        <table>
            { Array(tableData.length).fill().map((tr, i) => <Tr rowIndex={i} />) }       {/* 반복문 */}
        </table>
    );
});

export default Table;