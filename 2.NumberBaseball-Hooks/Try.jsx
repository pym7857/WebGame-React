import React, { memo } from 'react';

const Try = memo(({ tryInfo }) => { // Hooks에서는 memo가, class에서의 PureComponent역할 
    return (
        <li>
            <div>{tryInfo.try}</div>
            <div>{tryInfo.result}</div>
        </li>
    )
});

/* import React, { PureComponent } from 'react';

class Try extends PureComponent {
    render() {
        return (
            <li>
                <div>{this.props.tryInfo.try}</div>
                <div>{this.props.tryInfo.result}</div>
            </li>
        );
    }
} */

export default Try;