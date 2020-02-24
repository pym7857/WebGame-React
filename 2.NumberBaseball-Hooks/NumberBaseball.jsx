import React, { useState } from 'react';
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

const NumberBaseball = () => {
    const [result, setResult] = useState('');
    const [value, setValue] = useState('');
    const [answer, setAnswer] = useState(getNumbers());
    const [tries, setTries] = useState([]);

    const onSubmitForm = (e) => { // 얘를 화살표 함수로 안쓰면 this를 쓸 수 없음 -> 이때는 1.constructor 써줘야됨 2.그 안에 this.onSubmitForm = this.onSubmitForm.bind() 필요
        e.preventDefault();
        if (value === answer.join('')) {
            setResult('홈런!');
            setTries((prevTries) => {
                return [...prevTries, { try: value, result: '홈런!' }]
            })
            alert('게임을 다시 시작합니다!');
            setValue('');
            setAnswer(getNumbers());
            setTries([]);
        } else { // 답 틀렸으면
            const answerArray = value.split('').map((v) => parseInt(v)); // 1234 -> [1,2,3,4]
            let strike = 0;
            let ball = 0;

            if (tries.length >= 9) { // 10번 이상 틀렸을 때 
                setResult(`10번 넘게 돌려서 실패! 답은 ${answer.join(',')}였습니다!`)
                alert('게임을 다시 시작합니다!');
                setValue('');
                setAnswer(getNumbers());
                setTries([]);
            } else { // 몇 볼, 몇 스트라이크 인지 판단 
                for (let i=0;i<4;i+=1) {
                    if (answerArray[i] === answer[i]) {
                        strike += 1
                    } else if (answer.includes(answerArray[i])) {
                        ball += 1
                    }
                }
                setTries((prevTries) => {
                    return [...prevTries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다.`}]
                })
                setValue('');
            }
        }
    };

    const onChangeInput = (e) => {
        setValue(e.target.value);
    };

    return (
        <>
            <h1>{result}</h1>
            <form onSubmit={onSubmitForm}>
                <input maxLength={4} value={value} onChange={onChangeInput} />     {/* value 와 onChangeInput은 짝꿍  */}
            </form>
            <div>시도: {tries.length}</div>
            <ul>
                {tries.map( (v, i) => {      /* React에서 반복문은 map 사용  */
                    return (
                        <Try key={`${i + 1}차 시도 : `} tryInfo={v} />
                    );
                })}
            </ul>
        </>
    );
};

export default NumberBaseball;