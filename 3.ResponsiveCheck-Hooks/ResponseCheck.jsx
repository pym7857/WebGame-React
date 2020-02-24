import React, { useState, useRef } from 'react';

const ResponseCheck = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭해서 시작하세요.');
    const [result, setResult] = useState([]);
    const timeout = useRef(null); // Ref가 DOM객체에 접근하는것 이외에 "state가 아닌것의 변수선언 기능"도 한다 !!
    const startTime = useRef();
    const endTime = useRef();

    const onClickScreen = () => {
        if (state === 'waiting') {
            setState('ready');
            setMessage('초록색이 되면 바로 클릭하세요.');
            timeout.current = setTimeout( () => { // Ref는 안에 current가 들어있기 때문에 current도 같이 써준다.
                setState('now');                
                setMessage('지금 클릭 !');
                startTime.current = new Date(); // 시간 체크 start 
            }, Math.floor(Math.random() * 1000) + 2000); // 2초~3초 랜덤 
        } else if (state === 'ready'){ // 성급하게 클릭 
            clearTimeout(timeout.current); // clearTimeout으로 돌아가고 있는 
            setState('waiting');
            setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요. (클릭하시면 다시 시작합니다.)');
        } else if (state === 'now') {
            endTime.current = new Date();
            setState('waiting');
            setMessage('클릭해서 시작하세요.');
            setResult((prevResult) => {
                return [...prevResult, endTime.current - startTime.current];
            });
        }
    };

    const onReset = () => {
        setResult([]);
    };

    const renderAverage = () => {
        return result.length === 0 
        ? null
        : <>
            <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
            <button onClick={onReset}>리셋</button>
          </>
    };

    return ( // setState하면 render() 되지만, useRef로 선언된것들은 바껴도 render()다시 되지 X -> 불필요한 렌더링 막을 수 O
        <>
            <div
                id="screen"
                className={state} onClick={onClickScreen}>
                {message}
            </div>
            {renderAverage()}
        </>
    );
};

export default ResponseCheck; // import ResponseCheck from './ResponseCheck';