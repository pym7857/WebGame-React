import React, { PureComponent } from 'react';

class Ball extends PureComponent {   // React.PureComponent는 shouldComponentUpdate가 이미 구현되어 있는것임. props와 state를 얕은 비교를 통해 비교한 뒤 '변경된 것이 있을 때만' 리렌더링한다.
    render() {
        const { number } = this.props;
        let background;
        if (number <= 10) {
            background = 'red';
        } else if (number <= 20) {
            background = 'orange';
        } else if (number <= 30) {
            background = 'yellow';
        } else if (number <= 40) {
            background = 'blue';
        } else {
            background = 'green';
        }

        return (
            <div className="ball" style={{ background }}>{number}</div>
        );
    }
}

// 여기서 const Ball = {} 쓰는것은 Hooks가 아니다! 그냥 함수 컴포넌트임. 
// useState, useRef 쓰이는것이 Hooks 이다. 

export default Ball;