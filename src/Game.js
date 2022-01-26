import React from 'react';
import Perdu from './Perdu';
import Gagne from './Gagne';
//import logo from './logo.svg';


function unite( nombre ){
	var unite;
	switch( parseInt(nombre) ){
		case 0: unite = "zero";		break;
		case 1: unite = "un";		break;
		case 2: unite = "deux";		break;
		case 3: unite = "trois"; 	break;
		case 4: unite = "quatre"; 	break;
		case 5: unite = "cinq"; 	break;
		case 6: unite = "six"; 		break;
		case 7: unite = "sept"; 	break;
		case 8: unite = "huit"; 	break;
        default: break;
	}
	return unite;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


class CaseMine extends React.Component {
    render() {
        var className = this.props.etat + " case";
        var content = (this.props.etat !== "close" && this.props.etat !== "flag") ? this.props.value : null;

        return (
            <button
                className={className}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
            >
                <span>
                    {content}
                </span>
            </button>
        );
    }

}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.nbCaseTrouve = 0;
        this.nbCase = (props.x * props.y - props.n);
        const bombes = this.calculateScore(this.createBoard(props.x, props.y, props.n));


        this.state = {
            bombes: bombes,
            etat: this.createEtatArray(props.x, props.y),
            jouable: true,
            victoire: false,
            defaite: false,
            n: props.n,
            flags: 0,
        };
    }

    createEtatArray(x, y) {
        var etatArray = [];
        var etatRow = new Array(y).fill("close");
        for (var i = 0; i < x; i++) {
            etatArray.push(etatRow.slice());
        }
        return etatArray;
    }

    createBoard(x, y, n) { //number of row, column and bombs
        var game = [];
        for (var i = 0; i < x; i++) {
            var row = new Array(y).fill("");
            game.push(row);
        }
        var count = 0;
        while (count < n) { //Generate bombs
            var xPos = getRandomInt(x);
            var yPos = getRandomInt(y);
            if (game[xPos][yPos] !== "💣") {
                game[xPos][yPos] = "💣";
                count++;
            }

        }
        return game;
    }

    countBombs(bombes, x, y) {
        var count = 0;
        for (var xpos = x - 1; xpos <= x + 1; xpos++) {
            for (var ypos = y - 1; ypos <= y + 1; ypos++) {
                try {
                    if (bombes[xpos][ypos] === "💣") {
                        count++;
                    }
                } catch (e) { }
            }
        }
        return count;
    }

    calculateScore(bombes) {
        for (var i = 0; i < bombes.length; i++) {
            for (var j = 0; j < bombes[0].length; j++) {
                if (bombes[i][j] !== "💣") {
                    var count = this.countBombs(bombes, i, j);
                    bombes[i][j] = count === 0 ? "" : count + "";
                }
            }
        }
        return bombes;
    }

    changeAroundState(grid, x, y) {
        if (this.state.bombes[x][y] === "") {
            for (var xpos = x - 1; xpos <= x + 1; xpos++) {
                for (var ypos = y - 1; ypos <= y + 1; ypos++) {
                    try {
                        if (grid[xpos][ypos] === "close") {
                            this.changeState(grid, xpos, ypos);
                        }
                    } catch (e) { }
                }
            }
        }
    }

    changeState(grid, x, y) {
        if (grid[x][y] === "close") {
            if (this.state.bombes[x][y] === "💣") {
                grid[x][y] = "boom";
                this.gameOver();
            } else {
                grid[x][y] = "open " + unite(this.state.bombes[x][y]);
                this.nbCaseTrouve++;
                if (this.nbCaseTrouve === this.nbCase) {
                    this.victoire();
                } else {
                    this.changeAroundState(grid, x, y);
                }
            }
        }
    }

    propagateOpening(x, y) {
        const grid = this.state.etat.slice();
        this.changeState(grid, x, y);
        this.setState({etat: grid});
    }

    gameOver() {
        const gridBomb = this.state.bombes.slice();
        const gridEtat = this.state.etat.slice();
        this.revealBombs(gridBomb, gridEtat);
        this.setState({jouable: false, defaite: true, etat: gridEtat});
    }

    revealBombs(gridBomb, gridEtat) {
        for (var x = 0; x < gridBomb.length; x++) {
            for (var y = 0; y < gridBomb[0].length; y++) {
                if (gridBomb[x][y] === "💣" && this.state.etat[x][y] !== "flag") {
                    gridEtat[x][y] = "boom";
                } else if (gridBomb[x][y] !== "💣" && this.state.etat[x][y] === "flag") {
                   gridEtat[x][y] = "false-flag";
                }
            }
        }
    }

    victoire() {
        this.setState({jouable: false, victoire: true});
    }

    handleClick(x, y) {
        if (this.state.jouable) {
            this.propagateOpening(x, y);
        }
    }

    showFlag(x, y) {
        if (this.state.jouable) {
            const etat = this.state.etat.slice();
            if (etat[x][y] === "close" && this.state.flags < this.state.n) {
                etat[x][y] = "flag";
                const flags = this.state.flags + 1;
                this.setState({ etat: etat, flags: flags });
                navigator.vibrate(70);
            } else if (etat[x][y] === "flag") {
                etat[x][y] = "close";
                const flags = this.state.flags - 1;
                this.setState({ etat: etat, flags: flags });
                navigator.vibrate(70);
            }
        }
    }

    render() {
        return (
            <div id="game">
                <div id="nbr-restant">{this.state.flags}/{this.state.n} 🚩 restants</div>
                <div id="victoire">{(this.state.victoire ? <Gagne /> : (this.state.defaite ? <Perdu /> : ""))}</div>
                <div>
                    {this.state.bombes.map((value, index) => 
                        <div className="demineur-row">
                            {value.map((value2, index2) =>
                                <CaseMine
                                    key={index*this.props.x+index2}
                                    value={value2}
                                    etat={this.state.etat[index][index2]}
                                    onClick={() => this.handleClick(index, index2)}
                                    onContextMenu={() => this.showFlag(index, index2)}
                                />)
                            }
                        </div>)
                    }
                </div>
            </div>
        );
    }
}

export default Game;

