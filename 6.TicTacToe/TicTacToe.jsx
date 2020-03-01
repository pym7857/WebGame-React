import React, { useState, useReducer, useCallback, useEffect } from 'react';
import Table from './Table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['', '', ''], 
        ['', '', ''], 
        ['', '', '']
    ],
    recentCell: [-1, -1], // 가장 최근 눌렀던 셀을 기억 
};

export const SET_WINNER = 'SET_WINNER';     // export 붙여서 모듈로 만들어버림. -> 다른 jsx에서도 쓸 수 있도록 
export const CLICK_CELL = 'CLICK_CELL';     
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

const reducer = (state, action) => {    // 해당 액션 정의 
    switch (action.type) {
        case SET_WINNER:
            // state.winner = action.winner;  -> 이렇게 하면 안됨 ! 
            return {
                ...state,               // 기존 State를 얉은 복사 (=React의 기본: 불변성을 지켜야됨)
                winner: action.winner,  // 기존 State에서 바뀌는 부분만 바꿈.
            };
        case CLICK_CELL: 
            const tableData = [...state.tableData];              // 기존의 tableData를 얉은 복사(=3 dot)
            tableData[action.row] = [...tableData[action.row]];  // immer라는 라이브러리로 가독성 해결 
            tableData[action.row][action.cell] = state.turn;     // 턴 바꿔주기 
            return {
                ...state,
                tableData,  // 원하는 부분만 바꿈 
                recentCell: [action.row, action.cell], // 최근 클릭 셀 
            };
        case CHANGE_TURN:
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O',
            };
        case RESET_GAME:
            return {
                ...state,
                turn: 'O',
                tableData: [
                    ['', '', ''], 
                    ['', '', ''], 
                    ['', '', '']
                ],
                recentCell: [-1, -1], 
            };
        default:
            return state;
    }
};

const TicTacToe = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, turn, winner, recentCell } = state;  // 구조분해 

    //const [winner, setWinner] = useState('');
    //const [turn, setTurn] = useState('O');
    //const [tableData, setTableData] = useState([['', '', ''], ['', '', ''], ['', '', '']]); // 3 x 3

    const onClickTable = useCallback( () => {
        dispatch({ type: SET_WINNER, winner: 'O' });    // dispatch: 액션 실행 
    }, []);

    /* 승리 판단은 useEffect 에서 !! (state는 비동기 이기때문에..) */
    useEffect( () => {
        const [row, cell] = recentCell; // 구조 분해 
        if (row < 0) { // 초기상태일때 승자 판단하는경우 필터링 
            return;
        }
        
        let win = false;
        if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
            win = true;
        }
        if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
            win = true;
        }
        if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
            win = true;
        }
        if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
            win = true;
        }

        console.log(turn);
        if (win) { // 승리시 
            dispatch({ type: SET_WINNER, winner: turn });
            dispatch({ type: RESET_GAME });
        } else {
            // 다 찼는지 검사 (무승부인지 검사)
            let all = true;
            tableData.forEach( (row) => {
                row.forEach( (cell)=> {
                    if (!cell) {
                        all = false;
                    }
                });
            });

            if (all) { // 무승부
                dispatch({ type: RESET_GAME });
            } else {
                dispatch({ type: CHANGE_TURN });
            }
        }

    }, [recentCell]); // 최근 클릭한 셀이 바뀔때마다 

    return (
        <>
            <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
            {winner && <div>{winner}님의 승리!</div>}
        </>
    )
};

export default TicTacToe;