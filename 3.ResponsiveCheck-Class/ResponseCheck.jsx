import React, {Component } from 'react';

class ResponseCheck extends Component {
    state = {
       state: 'waiting', // 색깔 
       message: '클릭해서 시작하세요.',
       result: [], // 반응속도 평균 시간
    };

    timeout;
    startTime; 
    endTime; // state에 넣으면 얘네 바뀔때마다 렌더링 계속 되버리니 밖으로 빼자.
    
    onClickScreen = () => {
        if (this.state.state === 'waiting') {
            this.setState({
                state: 'ready',
                message: '초록색이 되면 바로 클릭하세요.'
            });
            this.timeout = setTimeout( () => {
                this.setState({
                    state: 'now',
                    message: '지금 클릭 !',
                });
                this.startTime = new Date(); // 시간 체크 start 
            }, Math.floor(Math.random() * 1000) + 2000); // 2초~3초 랜덤 
        } else if (this.state.state === 'ready'){ // 성급하게 클릭 
            clearTimeout(this.timeout); // clearTimeout으로 돌아가고 있는 
            this.setState({
                state: 'waiting',
                message: '너무 성급하시군요! 초록색이 된 후에 클릭하세요. (클릭하시면 다시 시작합니다.)',
            });
        } else if (this.state.state === 'now') {
            this.endTime = new Date();
            this.setState((prevState) => {
                return {
                    state: 'waiting',
                    message: '클릭해서 시작하세요.',
                    result: [...prevState.result, this.endTime - this.startTime], // 그냥 push하면 X
                };
            });
        }
    };

    onReset = () => {
        this.setState({
            result:[],
        });
    };

    renderAverage = () => {
        return this.state.result.length === 0 // 삼항 연산자
        ? null
        : <>
            <div>평균 시간: {this.state.result.reduce((a, c) => a + c) / this.state.result.length}ms</div>
            <button onClick={this.onReset}>리셋</button>
          </>
        /* 배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값); */
    }

    render() { 
        return (
            <>
                <div
                    id="screen"
                    className={this.state.state} onClick={this.onClickScreen}>
                    {this.state.message}
                </div>
                {this.renderAverage()}
            </>
        );
    }
}

export default ResponseCheck; // import ResponseCheck from './ResponseCheck';