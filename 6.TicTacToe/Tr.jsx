import React, { useRef, useEffect, memo, useMemo } from 'react';
import Td from './Td';

const Tr = memo( ({ rowData, rowIndex, dispatch }) => {

    // ============================ 디버깅 ============================
    console.log('tr rendered !');  
    /* 뭐가 바뀌고, 뭐가 안바뀌는지 디버깅 해보는 부분 */
    const ref = useRef([]);
    useEffect( () => {
        console.log(rowData === ref.current[0], rowIndex === ref.current[1], 
            dispatch === ref.current[2]);               // 바뀌는게 있으면 false가 될것이다. 그럼 걔때문에 리렌더링 발생하는것.     
                                                        // 한칸 눌렀더니, (콘솔창)false false false    -> 딱 한번만 찍힘 (=얘 문제는 아님)

        ref.current = [rowData, rowIndex, dispatch];
    }, [rowData, rowIndex, dispatch]);
    // ================================================================

    return (
        <tr>
            {Array(rowData.length).fill().map( (td, i) => (
                <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>{''}</Td>
            ))}
        </tr>
    )
    /*      //useMemo로 컴포넌트 자체를 기억하는 방법 (지금은 memo로 성능 최적화를 한 상태이기 때문에 의미는 없음)
    return (
        <tr>
            {Array(rowData.length).fill().map( (td, i) => (
                useMemo(    
                    () => <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>{''}</Td>,
                    [rowData[i]]    // rowData가 바꼈을때만 새로 렌더링 
                )
            ))}
        </tr>
    ) */
});

export default Tr;