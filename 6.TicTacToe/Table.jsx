import React from 'react';
import Tr from './Tr';

const Table = ({ tableData, dispatch }) => {
    return (
        <table>
            {Array(tableData.length).fill().map( (tr, i) => (
                <Tr key={i} dispatch={dispatch} rowIndex={i} rowData={tableData[i]} />      
            ))}      {/* Array(tableData.length) === 3 */}
        </table>
    );
};

export default Table;