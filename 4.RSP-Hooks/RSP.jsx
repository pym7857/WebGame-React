import React, { useState, useRef, useEffect } from 'react';

// 클래스의 경우 : constructor -> 최초render -> ref -> componentDidMount 
// -> (setState/props변경될때 -> shouldComponentUpdate(true) -> true면, render(리렌더링) ->  componentDidUpdate)
// 부모가 나를 없앴을 때 -> componentWillUnmount -> 소멸 

const rspCoords = {
    바위: '0',
    가위: '-142px',
    보: '-284px',
};

const scores = {
    가위: 1,
    바위: 0,
    보: -1,
};

/*
    - Object.entries(obj) : [key, value] 쌍이 반환되는 객체입니다.
    - find는 반복문이지만, return이 True가 되면(=원하는것을 찾으면) 멈춤.
*/
const computerChoice = (imgCoord) => {      // imgCoord는 숫자 
    return Object.entries(rspCoords).find(function(v) {
        return v[1] === imgCoord;
    })[0];      // rspCoords의 key를 반환 (=한글을 반환)
};

const RSP = () => {
    const [result, setResult] = useState('');
    const [imgCoord, setImgCoord] = useState(rspCoords.바위);
    const [score, setScore] = useState(0);
    const interval = useRef();

    /* useEffect(함수, 배열) : Hooks에서 '라이프사이클' 역할을 하는 코드를 적어주는 곳 입니다.*/
    useEffect( () => {      // componentDidMount, componentDidUpdate역할 (1대1 대응은 아님)
        console.log('다시 실행');
        interval.current = setInterval(changeHand, 100);
        return () => {      // componentWillUnmount역할
            console.log('종료');
            clearInterval(interval.current);
        }
    }, [imgCoord]); // 배열에 넣은값(imgCoord)들이 바뀔 때마다 useEffect가 실행됩니다. (이거 안써주면 처음에만 실행되고 다시는 바뀌지 않음)
    
    // (콘솔) 다시실행 종료 / 다시실행 종료 / 다시실행 종료 / 다시실행 종료 ...
    // 위 코드는 setInterval 과 clearInterval이 계속 반복 되기 때문에, 결국 setTimeout과 같은 역할을 하는것입니다.

    const changeHand = () => {
        if (imgCoord === rspCoords.바위) {
            setImgCoord(rspCoords.가위);
        } else if (imgCoord === rspCoords.가위) {
            setImgCoord(rspCoords.보);
        } else if (imgCoord === rspCoords.보) {
            setImgCoord(rspCoords.바위);
        }
    }

    const onClickBtn = (choice) => () => {
        clearInterval(interval.current); // Ref는 current
        const myScore = scores[choice]; 
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if (diff === 0) {
            setResult('비겼습니다!');
        } else if ([-1,2].includes(diff)) {
            setResult('이겼습니다!');
            setScore((prevScore) => prevScore + 1);
        } else {
            setResult('졌습니다!');
            setScore((prevScore) => prevScore - 1);
        }
        // 결과확인 후, 2초간 멈췄다가..
        setTimeout( () => {
            interval.current = setInterval(changeHand, 100); // 멈췄던 그림 다시 돌아가도록..
        }, 2000);
    };
    
    return (
        <>
            <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
            <div>
                <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
                <button id="scissor" className="btn" onClick={onClickBtn('가위')}>가위</button>
                <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
            </div>
            <div>{result}</div>
            <div>현재 {score}점</div>
        </>
    );

}

export default RSP;