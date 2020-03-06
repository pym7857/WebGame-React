import React, { useState, useCallback, useContext, memo } from 'react';
import { TableContext } from './MineSearch';
import { START_GAME } from './MineSearch';

const Form = memo( () => {
    const [row, setRow] = useState(10); // 세로 몇줄
    const [cell, setCell] = useState(10); // 가로 몇칸 
    const [mine, setMine] = useState(20);
    const { dispatch } = useContext(TableContext);  // Context API 불러오기 (구조분해)

    const onChangeRow = useCallback( (e) => {
        setRow(e.target.value);
    }, []);

    const onChangeCell = useCallback( (e) => {
        setCell(e.target.value);
    }, []);

    const onChangeMine = useCallback( (e) => {
        setMine(e.target.value);
    }, []);

    const onClickBtn = useCallback( () => {
        dispatch({ type: START_GAME, row, cell, mine });    // 우리가 Form에서 입력한 값을 액션에 전해준다.
    }, [row, cell, mine]);

    return (
        <div>
            <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
            <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
            <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
            <button onClick={onClickBtn}>시작</button>
        </div>
    );
});

export default Form