// 불러오기 
const React = require('react');
const { useState, useRef} = React; // 구조분해 문법 (React.useState -> useState)

const GuGuDan = () => { // 함수형 프로그래밍 -> Hooks
    const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
    const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const inputRef = useRef();

    const onChangeInput = (e) => {
        setValue(e.target.value); // setState 없어짐 
    };

    const onSubmitForm = (e) => {
        e.preventDefault();
        if (parseInt(value) === first * second) {
            setResult(value + ' 정답!');
            setFirst(Math.ceil(Math.random() * 9));
            setSecond(Math.ceil(Math.random() * 9));
            setValue('');
            inputRef.current.focus();
        } else {
            setResult(' 땡!');
            setValue('');
            inputRef.current.focus(); // 'ref' DOM에 접근할때 current붙여주기 
        }
    };

    return (
        <React.Fragment>
            <div> {first} 곱하기 {second}는? </div>
            <form onSubmit={onSubmitForm}>
                <input ref={inputRef} onChange={onChangeInput} value={value}/>
                <button>입력!</button>
            </form>
            <div id="result">{result}</div>
        </React.Fragment>
    );
};

module.exports = GuGuDan; // 쪼갠파일을 바깥에서도 사용할 수 있도록 해줌 

/* 파일을 쪼개는 경우에는 불러오기(첫줄)와 module.exports(마지막줄)를 계속 적어주어야 한다. */