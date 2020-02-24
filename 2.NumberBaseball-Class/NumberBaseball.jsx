import React, {Component, createRef } from 'react';
import Try from './Try';

/* this안쓸때는 이런식으로 함수를 class 바깥으로 빼낼 수 있음 */
function getNumbers() { // 숫자 네 개를 겹치지 않고 랜덤하게 뽑는 함수   
    const candidate = [1,2,3,4,5,6,7,8,9];
    const array = [];
    for (let i = 0; i < 4; i += 1) {
        const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0]; // Math.random() : 0 ~ 1,   splice(인덱스, 뽑아낼 갯수)
        array.push(chosen);
    }
    return array;
}

class NumberBaseball extends Component {
    state = {
        result: '',
        value: '',
        answer: getNumbers(), // ex: [1,3,5,7]
        tries: [], // push쓰면 안됨. (바뀐것을 React가 감지하지 못함. 그러면 렌더링 안됨) 
                    // -> 해결책: const tries2 = [...tries, 1] (이전 배열복사 + 원하는값(또는 객체) 넣기)
    };

    onSubmitForm = (e) => { // 얘를 화살표 함수로 안쓰면 this를 쓸 수 없음 -> 이때는 1.constructor 써줘야됨 2.그 안에 this.onSubmitForm = this.onSubmitForm.bind() 필요
        e.preventDefault();
        console.log(this.state.answer, this.state.value);
        if (this.state.value === this.state.answer.join('')) {
            this.setState((prevState) => { // (30줄)옛날 state로 현재 state를 만들때는 함수형 setState사용 !!
                return {
                    result: '홈런!',
                    tries: [...prevState.tries, { try: this.state.value, result: '홈런!' }],
                };
            });
            alert('게임을 다시 시작합니다!');
            this.setState({
                value: '',
                answer: getNumbers(),
                tries: [],
            });
            this.inputRef.current.focus();
        } else { // 답 틀렸으면
            const answerArray = this.state.value.split('').map((v) => parseInt(v)); // 1234 -> [1,2,3,4]
            let strike = 0;
            let ball = 0;

            if (this.state.tries.length >= 9) { // 10번 이상 틀렸을 때 
                this.setState({
                    result: `10번 넘게 돌려서 실패! 답은 ${this.state.answer.join(',')}였습니다!`,
                });
                alert('게임을 다시 시작합니다!');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries: [],
                });
                this.inputRef.current.focus();
            } else { // 몇 볼, 몇 스트라이크 인지 판단 
                for (let i=0;i<4;i+=1) {
                    if (answerArray[i] === this.state.answer[i]) {
                        strike += 1
                    } else if (this.state.answer.includes(answerArray[i])) {
                        ball += 1
                    }
                }
                this.setState((prevState) => {
                    return {
                        tries: [...prevState.tries, { try: this.state.value, result: `${strike} 스트라이크, ${ball} 볼입니다.`}],
                        value: '',
                    };
                });
            }
        }
    };

    onChangeInput = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    inputRef = createRef(); // class문법에서 createRef 쓰면 밑에처럼 함수 만들 필요x
                            // 위에서 this.inputRef.current.focus(); 로 해주어야됨 (Hooks ref 문법과 통일성 맞추는 효과)
    /* onInputRef = (c) => { this.inputRef = c; } */

    render() { /* render()는 화살표 함수 쓸 필요 없음 */
        return (
            <>
                <h1>{this.state.result}</h1>
                <form onSubmit={this.onSubmitForm}>
                    <input ref={this.inputRef} maxLength={4} value={this.state.value} onChange={this.onChangeInput} />     {/* value 와 onChangeInput은 짝꿍  */}
                </form>
                <div>시도: {this.state.tries.length}</div>
                <ul>
                    {this.state.tries.map( (v, i) => {      /* React에서 반복문은 map 사용  */
                        return (
                            <Try key={`${i + 1}차 시도 : `} tryInfo={v} />
                        );
                    })}
                </ul>
            </>
        );
    }
}

export default NumberBaseball; // import NumberBaseball from './NumberBaseball';