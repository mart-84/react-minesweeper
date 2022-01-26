import React from 'react';
import Game from './Game';
import Controls from './Controls';


const x = 9;
const y = 9;
const n = 10;

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            i: 0,
            x: x,
            y: y,
            n: n,
        };
    }

    resetControl(x, y, n) {
        const i = this.state.i + 1;
        this.setState({
            i: i,
            x: x,
            y: y,
            n: n,
        });
    }

    render() {
        return (
            <div>
                <div id="game-panel">
                    <Game 
                        key={this.state.i}
                        x={this.state.x}
                        y={this.state.y}
                        n={this.state.n}
                    />
                </div>
                <div id="control-panel">
                    <Controls resetControl={this.resetControl.bind(this)} />
                </div>
            </div>
        );
    }
}

export default Board;