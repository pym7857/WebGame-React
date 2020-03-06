import React, { useReducer, createContext, useMemo, useEffect } from 'react';
import Table from './Table';
import Form from './Form';

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0,  // 0 이상이면 다 OPENED
};

export const TableContext = createContext({    // Context API
    // 초기값(자식에게 넘길것들)
    tableData: [],
    halted: false,
    dispatch: () => {},
});  

const initialState = {
    tableData: [],
    data: {
        row: 0,
        cell: 0,
        mine: 0,
    },
    timer: 0,
    result: '',
    halted: true,
    openedCount: 0,
}

const plantMine = (row, cell, mine) => {
    //console.log(row, cell, mine);
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }

    // 지뢰판 만들기
    const data = [];
    for (let i = 0; i < row; i ++) {
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell; j ++) {
            rowData.push(CODE.NORMAL);  // 처음: -1
        }
    }

    // 지뢰 심기 (현재 shuffle에는 몇번째 칸에 심을지 적혀있음)
    for (let i = 0; i < shuffle.length; i ++) {
        const ver = Math.floor(shuffle[i] / cell);
        const hor = shuffle[i] % cell;
        data[ver][hor] = CODE.MINE;
    }    

    //console.log(data);
    return data;
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

// reducer: action발생시에 state를 어떻게 바꿀지 처리하는 부분 
const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                data: {  // 세로, 가로, 지뢰개수 기록 
                    row: action.row, 
                    cell: action.cell, 
                    mine: action.mine,
                },  
                openedCount: 0,
                tableData: plantMine(action.row, action.cell, action.mine),  // plantMine(세로, 가로, 지뢰개수)
                halted: false,
                timer: 0,
            };
        case OPEN_CELL: {
            const tableData = [...state.tableData];
            //tableData[action.row] = [...state.tableData[action.row]];
            //tableData[action.row][action.cell] = CODE.OPENED; 
            tableData.forEach( (row, i) => {    // tableData전체 갱신준비 (혹시나 불변성 안지켜지는것 없도록)
                tableData[i] = [...state.tableData[i]];
            });
            const checked = [];  // 한번 검사한 칸은 다시 검사하지 않도록 
            let openedCount = 0;
            const checkAround = (row, cell) => {
                // 이미 열린칸이나 플래그,? 칸 필터링 
                if ([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
                    return;
                }
                // 상하좌우 칸이 아닌 경우 필터링 
                if (row < 0 || row > tableData.length - 1 || cell < 0 || cell > tableData[0].length - 1) {
                    return;
                }
                // 검사된 경우는 다시 검사하지 않도록 
                if (checked.includes(row + ',' + cell)) {
                    return;
                } else {
                    checked.push(row + ',' + cell); // checked에 넣기 
                }


                /* 내 주변 칸 지뢰개수 검사하는 부분 */
                let around = [];  // 내 주변 칸의 해당 넘버  
                if (tableData[row -1]){  // 내 윗칸이 존재한다면..
                    around = around.concat(
                        tableData[row-1][cell-1],  // 내 윗칸 가로 3줄 
                        tableData[row-1][cell],
                        tableData[row-1][cell+1],
                    );
                }
                around = around.concat(
                    tableData[row][cell-1],   // 내 양 옆칸
                    tableData[row][cell+1],
                );
                if (tableData[row +1]){  // 내 아랫칸이 존재한다면..
                    around = around.concat(
                        tableData[row+1][cell-1],  // 내 아랫칸 가로 3줄 
                        tableData[row+1][cell],
                        tableData[row+1][cell+1],
                    );
                }
                // 내 주변칸(최대 8칸)중에서 지뢰인 애들의 개수를 센다.
                const count = around.filter( (v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v) ).length;

                /* 주변 칸을 클릭하는 부분 */
                if (count === 0) { // 주변 지뢰개수 0개일때, 주변 칸 오픈
                    const near = [];  // near 배열에는 [row, cell] 담김 (좌표)
                    if (row - 1 > - 1) {
                        near.push([row-1, cell-1]); // 윗칸 가로 3줄 [row, cell]
                        near.push([row-1, cell]);
                        near.push([row-1, cell+1]);
                    }
                    near.push([row, cell-1]); // 양 옆 2칸 [row, cell]
                    near.push([row, cell+1]);
                    if (row + 1 < tableData.length) {
                        near.push([row+1, cell-1]); // 아랫칸 가로 3줄 [row, cell]
                        near.push([row+1, cell]);
                        near.push([row+1, cell+1]);
                    }

                    //console.log('around, near = ',around, near);

                    near.forEach( (n) => {  // 주변칸 들 클릭해주는 함수 (재귀함수)
                        if (tableData[n[0]][n[1]] !== CODE.OPENED) {    // 닫혀있는것만 열어줘야 한다.
                            checkAround(n[0], n[1]);
                        }
                    })
                }

                // 내 칸이 닫힌 칸 이면 '카운트 증가' ★
                if (tableData[row][cell] === CODE.NORMAL) {
                    openedCount += 1;
                }

                tableData[row][cell] = count;   // 최종적으로 내 칸에 count적용 ★
            };

            checkAround(action.row, action.cell);

            /* 승리 조건 */
            let halted = false;
            let result = '';
            //console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);
            if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
                halted = true;
                result = `${state.timer}초 만에 승리하셨습니다!`;
            }

            return {
                ...state,
                tableData,
                openedCount: state.openedCount + openedCount,
                halted,
                result,
            };
        }
        case CLICK_MINE: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE; 
            return {
                ...state,
                tableData,
                halted: true,
            };
        }
        case FLAG_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.MINE) {  // 지뢰가 있는 칸
                tableData[action.row][action.cell] = CODE.FLAG_MINE; 
            } else {  // 지뢰가 없는 칸 
                tableData[action.row][action.cell] = CODE.FLAG; 
            }
            return {
                ...state,
                tableData,
            };
        }
        case QUESTION_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {  // 깃발 지뢰인 경우 
                tableData[action.row][action.cell] = CODE.QUESTION_MINE; 
            } else { // 깃발이 없는 지뢰인 경우 
                tableData[action.row][action.cell] = CODE.QUESTION; 
            }
            return {
                ...state,
                tableData,
            };
        }
        case NORMALIZE_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {  // 물음표 지뢰인 경우 
                tableData[action.row][action.cell] = CODE.MINE; 
            } else { // 지뢰 없는 물음표인 경우 
                tableData[action.row][action.cell] = CODE.NORMAL; 
            }
            return {
                ...state,
                tableData,
            };
        }
        case INCREMENT_TIMER: {
            return {
                ...state,
                timer: state.timer + 1,
            }
        }
        default:
            return state;
    }
};


const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, halted, timer, result } = state;    // 구조분해 

    // TableContext.Provider에서 자식들에게 뿌리는 value는 항상 성능최적화 필요 -> 새로운 객체가 생성될때마다, 매번 호출되지 않도록 useMemo 사용 ! (= 캐싱(저장) 기법)
    const value = useMemo(() => ({  
        tableData,
        halted,
        dispatch
    }), [tableData, halted]);  // tableData가 바뀔때만 바뀜    (참고: dispatch는 항상 같게 유지되기때문에 여기 넣지않는다.)

    // 비동기(setInterval): useEffect로 처리 ..
    useEffect( () => {
        let timer;
        if (halted === false) {
            timer = setInterval( () => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        }
        
    }, [halted]);

    return (
        <TableContext.Provider value={ value }>
            <Form />
            <div>{ timer }</div>
            <Table />
            <div>{ result }</div>
        </TableContext.Provider>
    );
};

export default MineSearch;