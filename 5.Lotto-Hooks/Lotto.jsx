import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball';

// state안쓰는 애들은 이렇게 분리를 해놔야 class -> Hooks로 바꿀때 편하다.
function getWinNumbers() {
    console.log(getWinNumbers);     // Class에서는 이게 계속 콘솔에 찍히지 않았는데, 왜 Hooks에서는 계속 찍힐까 ? (Hooks는 바뀔때마다 코드 전체가 다 다시 실행되기 때문)
                                    // useMemo를 사용하자.
    const candidate = Array(45).fill().map( (v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);  
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c); 
    return [...winNumbers, bonusNumber];
}

/* 공식문서 Tip : 
    1. Hooks를 선언하면 순서를 항상 지켜줘야됨 
    2. Hooks선언을 조건문 안에 절대 넣으면 안되고, 함수나 반복문 안에도 왠만하면 넣지말아라. (Hooks선언은 항상 최상위에 놓자.)
    3. useEffect안에 useState넣으면 안됨. (실행순서 확실치 않기 때문)
*/
const Lotto = () => { 
    const lottoNumbers = useMemo( () => getWinNumbers(), []); // useMemo : 두번째 인자인 []가 바뀌지 않는한, 메모 해놓은 함수가 다시 실행되지 않는다.
    const [winNumbers, setWinNumbers] = useState(lottoNumbers); // lottoNumbers로 변경 
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    useEffect( () => {
        console.log('useEffect');
        for (let i = 0; i < winNumbers.length -1; i++) {
            timeouts.current[i] = setTimeout( () => {       // 주의: timeouts.current가 바뀌는게 아님 !!
                setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
            }, (i + 1) * 1000); 
        }
        // 보너스공
        timeouts.current[6] = setTimeout( () => {
            setBonus(winNumbers[6]); 
            setRedo(true);
        }, 7000);

        return () => {      // componentWillUnmount()
            timeouts.current.forEach( (v) => {
                clearTimeout(v);
            });
        };
    }, [timeouts.current]);     // 두번째 인자가 빈 배열이면, componentDidMount랑 같음.
                                // 배열에 요소가 있으면, componentDidMount랑 componentDidUpdate 둘 다 수행

    /* 
        그렇다면.. useEffect에서, componentDidUpdate만 하고싶으면 어떻게 할까 ?
        -> 패턴이므로 외워두도록 하자.
        
        const mounted = useRef(false);
        useEffect( () => {
            if (!mounted.current) {
                mounted.current = true;     // componentDidMount는 일어나지만, 아무것도 안함.
            } else {
                // 작업 
            }
        }, [바뀌는값]);

    */

    const onClickRedo = useCallback( () => { // useCallback은 함수 자체를 기억. (여기 코드에서는 props로 이 함수를 넘기지 않기 때문에 굳이 필요는 없음)
        console.log(winNumbers);
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = []; // Ref에는 current붙혀주는것 잊지말자 ~! 
                                // 주의: timeouts.current가 바뀌는 부분 !!
    }, [winNumbers]);   // winNumbers가 바뀔때만 이 함수 다시 실행 !

    return (
        <>
            <div>당첨 숫자</div>
            <div id="결과창">
                {winBalls.map( (v) => <Ball key={v} number={v} />)}     {/* 반복문 */}
            </div>
            <div>보너스!</div>
            {bonus && <Ball number={bonus} />}      {/* 조건문 */}
            {redo && <button onClick={onClickRedo}>한 번 더 !</button>}     {/* 조건문 */}
        </>
    );
}

export default Lotto;