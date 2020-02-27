import React, { Component } from 'react';
import Ball from './Ball';

function getWinNumbers() {
    const candidate = Array(45).fill().map( (v, i) => i + 1); // 1~ 45 까지의 숫자 배열 생성 
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);     // splice : (위치, 자를갯수)를 배열로 반환
    }
    const bonusNumber = shuffle[shuffle.length - 1]; // 마지막숫자 = bonus
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c); // 앞에서 6개는 당첨숫자 (숫자순으로 정렬)
    return [...winNumbers, bonusNumber];
}

class Lotto extends Component {
    state = {
        winNumbers: getWinNumbers(), // 미리 뽑아둠 
        winBalls: [], // 6개 숫자
        bonus: null, // 보너스 숫자 
        redo: false,
    };

    timeouts = [];

    runTimeouts = () => {
        const { winNumbers } = this.state;

        // 보통 비동기에 for문 쓰면 클로저 문제가 발생하지만, let을 쓰면 클로저문제 발생 X (ES6 문법)
        for (let i = 0; i < winNumbers.length -1; i++) {
            this.timeouts[i] = setTimeout( () => {
                this.setState( (prevState) => {
                    return {
                        winBalls: [...prevState.winBalls, winNumbers[i]], // push쓰면 안되고 이렇게..
                    };
                });
            }, (i + 1) * 1000); // 첫번째 공은 1초뒤, 2번째 공은 2초뒤...
        }
        // 보너스공
        this.timeouts[6] = setTimeout( () => {
            this.setState({
                bonus: winNumbers[6],
                redo: true, // 한 번 더! 버튼이 이제 보임.
            });
        }, 7000); // 7초 후 
    };

    componentDidMount() {
        console.log('didMount');
        this.runTimeouts();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('didUpdate');   // DidUpdate는 첫렌더링 일때를 제외하고는 계속 뜬다.
        if (this.timeouts.length === 0) {   // componentDidUpdate에서는 이 조건문이 중요하다.
            this.runTimeouts();
        }
    }

    componentWillUnmount() { // 혹시 부모에서 자식props없앴을때를 대비해서, WillUnmount는 필수로 넣어주자. (메모리 누수 해결)
        this.timeouts.forEach( (v) => {
            clearTimeout(v);
        })
    }

    onClickRedo = () => { // 초기화 
        this.setState({
            winNumbers: getWinNumbers(), 
            winBalls: [],
            bonus: null, 
            redo: false,
        });
        this.timeouts = [];
    }

    render() {
        const { winBalls, bonus, redo } = this.state;
        return (
            <>
                <div>당첨 숫자</div>
                <div id="결과창">
                    {winBalls.map( (v) => <Ball key={v} number={v} />)}     {/* 반복문 */}
                </div>
                <div>보너스!</div>
                {bonus && <Ball number={bonus} />}      {/* 조건문 */}
                {redo && <button onClick={this.onClickRedo}>한 번 더 !</button>}     {/* 조건문 */}
            </>
        )  ;
    }
}

export default Lotto;