import React from 'react';


function Preset(props) {
    return (
        <div id="preset">
            <button onClick={props.facile}>Facile</button>
            <button onClick={props.moyen}>Moyen</button>
            <button onClick={props.expert}>Expert</button>
            <button onClick={props.perso}>Personnalisé</button>
        </div>
    );
}


class Controls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 9,
            y: 9,
            n: 10,
            persoSize: false,
        };
    }
    
    updateNSlider(x, y, n) {
        if (this.state.n > ((x * y) - 1)) {
            return ((x * y) - 1);
        } else {
            return n;
        }
    }

    updateSliderValue(id) {
        const newValue = parseInt(document.getElementById(id+"slider").value);
        var n = 1;
        switch (id) {
            case "x":
                n = this.updateNSlider(newValue, this.state.y, this.state.n);
                this.setState({x: newValue, n: n});
                break;
            case "y":
                n = this.updateNSlider(this.state.x, newValue, this.state.n);
                this.setState({y: newValue, n: n});
                break;
            case "n":
                this.setState({n: newValue});
                break;
            default:
                console.log("gros problème là");
        }
    }

    setPreset(x, y, n) {
        this.setState({x: x, y: y, n: n, persoChoice: false}, function(state, props) {
            this.props.resetControl(this.state.x, this.state.y, this.state.n);
        });
    }

    render() {
        return (
            <div>
                <button 
                    onClick={() => {this.props.resetControl(this.state.x, this.state.y, this.state.n)}}
                >Nouvelle partie</button>

                <Preset 
                    facile={() => this.setPreset(9, 9, 10)} 
                    moyen={() => this.setPreset(16, 16, 40)} 
                    expert={() => this.setPreset(16, 30, 99)} 
                    perso={() => this.setState({persoChoice: true})}
                />

                <div 
                    id="slider-panel" 
                    className={this.state.persoChoice ? "" : "none"}
                >
                    <input id="xslider" type="range" value={this.state.x} min="9" max="21" onChange={() => {this.updateSliderValue("x")}}/>
                    <output name="xvalue" id="xvalue">{this.state.x}</output>

                    <input id="yslider" type="range" value={this.state.y} min="9" max="30" onChange={() => {this.updateSliderValue("y")}}/>
                    <output name="yvalue" id="yvalue">{this.state.y}</output>

                    <input id="nslider" type="range" value={this.state.n} min="1" max={this.state.x * this.state.y - 1} onChange={() => {this.updateSliderValue("n")}}/>
                    <output name="nvalue" id="nvalue">{this.state.n}</output>
                </div> 
            </div>
        );
    }
}

export default Controls;