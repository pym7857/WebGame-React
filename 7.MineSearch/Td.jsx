import React, { useContext, useCallback, memo, useMemo } from 'react';
import { TableContext, CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL } from './MineSearch';

const getTdStyle = (code) => {
    switch (code) {
        case CODE.NORMAL:
        case CODE.MINE:
            return {
                background: '#444', // 검정 
            };
        case CODE.CLICKED_MINE:
        case CODE.OPENED:
            return {
                background: 'white',
            };
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:   
            return {
                background: 'yellow',
            };
        case CODE.FLAG_MINE:
        case CODE.FLAG:   
            return {
                background: 'red',
            };
        default:
            return {
                background: 'white',
            };
    }
};

const getTdText = (code) => {
    console.log('getTdText');   // 한개 열리면 -> 여긴 딱 한번만 실행됨. 
    switch (code) {
        case CODE.NORMAL:
            return '';
        case CODE.MINE:
            return 'X';
        case CODE.CLICKED_MINE:
            return '펑';
        case CODE.FLAG_MINE:
        case CODE.FLAG:   
            return '!';
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:   
            return '?';
        default:
            return code || '';    // 기본적으로 code가 표시되도록..(0은 표시 안 되도록..)(0은 false에 해당한다.)

        /* 자바스크립트의 ||, && 연산자는 불린값을 리턴하지 않는다. 값 자체를 리턴한다.
            따라서 값의 성질(true, false)에 따라 앞의 값이 출력되던지, 뒤의 값이 출력되던지 한다.

            or의 경우, 둘 중 하나만 true면 true를 반환하니까 만약 앞의 값이 false라면 뒤의 값을 리턴한다.
            뒤의 값이 true라면 true가 나오는 것이고, false면 false가 나올 테니까.
            물론 앞의 값이 true라면 뒤의 값을 볼 필요도 없이 앞의 값을 리턴한다. */
    }
};

const Td = memo( ({ rowIndex, cellIndex }) => {
    const { tableData, dispatch, halted } = useContext(TableContext);   // Provider에서 value로 전달했던것을 이렇게 바로 받을 수 있음 (useContext)

    const onClickTd = useCallback( () => {
        if (halted) {
            return;
        }
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.OPENED:
            case CODE.FLAG_MINE: 
            case CODE.FLAG:
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                return;
            case CODE.NORMAL:
                dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.MINE:
                dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });     
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted] );

    // 마우스 우클릭
    const onRightClickTd = useCallback( (e) => {
        if (halted) {
            return;
        }
        e.preventDefault();
        switch (tableData[rowIndex][cellIndex]) {
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.FLAG_MINE:
            case CODE.FLAG:
                dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
                return;
            default:
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted] );

    console.log('td rendered'); // Context API쓰면 table전체의 td가 리렌더링 되버림 ! ('td rendered' x 100)
                                // 여기부분은 리렌더링 되도 상관없음. 하지만 return 부분만 리렌더링 안되면 된다. -> useMemo 사용 ! -> 34번째 줄 콘솔로그 확인 !
                                // 즉, useMemo써도 아직 전부 깜빡이는건 마찬가지지만 34번째 줄 콘솔로그에서 확인할 수 있듯이 render는 한번만 실행되고 있다는걸 알 수 있다.

    return useMemo( () => (
        <td
            style={ getTdStyle(tableData[rowIndex][cellIndex]) }
            onClick={onClickTd}
            onContextMenu={onRightClickTd}
        >
        { getTdText(tableData[rowIndex][cellIndex]) }
        </td>
    ), [tableData[rowIndex][cellIndex]]);
});

export default Td;