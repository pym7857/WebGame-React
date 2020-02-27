import React, { Component } from 'react';

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

class RSP extends Component {
    state = {
        result: '',
        imgCoord: rspCoords.바위,
        score: 0,
    };

    interval;

    /* render안에 setState가 들어가면 안되기 때문에 라이프사이클 함수에 코딩 */

    componentDidMount() { // 컴포넌트가 첫렌더링 된 후 (라이프 사이클) -> 여기에 비동기 요청 함.
        this.interval = setInterval(this.changeHand, 100);
    }

    componentDidUpdate() { // 리렌더링 후

    }

    componentWillUnmount() { // 컴포넌트가 제거되기 직전 -> 여기에 비동기 요청 정리 함.(메모리 누수 문제 해결)
        clearInterval(this.interval);
    }

    /* 가위바위보 그림 계속 돌아가게 하는 부분 */
    changeHand = () => {
        const { imgCoord } = this.state; // (구조분해 문법) 이 호출 부분을 비동기 함수 바깥에 선언하면, 클로저 이슈 발생 !
        if (imgCoord === rspCoords.바위) {
            this.setState({
                imgCoord: rspCoords.가위,
            });
        } else if (imgCoord === rspCoords.가위) {
            this.setState({
                imgCoord: rspCoords.보,
            });
        } else if (imgCoord === rspCoords.보) {
            this.setState({
                imgCoord: rspCoords.바위,
            });
        }
    }

    onClickBtn = (choice) => () => {
        const { imgCoord } = this.state; // 구조 분해

        clearInterval(this.interval); // 잠시 멈춤 
        const myScore = scores[choice]; 
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if (diff === 0) {
            this.setState({
                result: '비겼습니다!',
            });
        } else if ([-1,2].includes(diff)) {
            this.setState((prevState) => {
                return {
                    result: '이겼습니다!',
                    score: prevState.score + 1, // 옛날 데이터에 더하는 경우 prevState사용 
                };
            });
        } else {
            this.setState((prevState) => {
                return {
                    result: '졌습니다!',
                    score: prevState.score - 1, // 옛날 데이터에 더하는 경우 prevState사용 
                };
            });
        }
        // 결과확인 후, 2초간 멈췄다가..
        setTimeout( () => {
            this.interval = setInterval(this.changeHand, 100); // 멈췄던 그림 다시 돌아가도록..
        }, 2000);
    };

    render() {
        const { result, score, imgCoord } = this.state; // 구조분해 문법 
        return (
            <>
                <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
                <div>
                    <button id="rock" className="btn" onClick={this.onClickBtn('바위')}>바위</button>
                    <button id="scissor" className="btn" onClick={this.onClickBtn('가위')}>가위</button>
                    <button id="paper" className="btn" onClick={this.onClickBtn('보')}>보</button>
                </div>
                <div>{result}</div>
                <div>현재 {score}점</div>
            </>

        );
    }
}

export default RSP;