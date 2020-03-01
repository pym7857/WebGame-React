import React, { useCallback, useEffect, useRef, memo } from 'react';
import { CLICK_CELL } from './TicTacToe';

const Td = memo( ({ rowIndex, cellIndex, dispatch, cellData }) => {
    
    // ============================ 디버깅 ============================
    console.log('td rendered !');   // 한번 클릭에 9번 실행됨 !
    /* 뭐가 바뀌고, 뭐가 안바뀌는지 디버깅 해보는 부분 */
    const ref = useRef([]);
    useEffect( () => {
        console.log(rowIndex === ref.current[0], cellIndex === ref.current[1], 
            dispatch === ref.current[2], cellData === ref.current[3]); // 바뀌는게 있으면 false가 될것이다. 그럼 걔때문에 리렌더링 발생하는것.
                                                                        // 한칸 눌렀더니, (콘솔창) true true true false     -> 딱 한번만 찍힘 (=얘 문제는 아님)
        ref.current = [rowIndex, cellIndex, dispatch, cellData];
    }, [rowIndex, cellIndex, dispatch, cellData]);
    // ================================================================

    const onClickTd = useCallback( () => {
        console.log(rowIndex, cellIndex);
        if(cellData) {
            return;
        }
        dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });     // React에서 state는 비동기. -> 비동기인 state에서 뭔가를 처리하려면 useEffect사용 !
    }, [cellData]);

    return (
        <td onClick={onClickTd}>{cellData}</td>
    )
});

export default Td;