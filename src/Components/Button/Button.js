import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';

export class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }
        this.getActive = this.getActive.bind(this)
    }
    getActive() {
        this.props.isActive(!this.state.active);
        this.setState({active: !this.state.active})
    }

    render() {
        return <button class={this.state.active ? "btn btn-danger" : "btn btn-success"} onClick={this.getActive }>
            {this.state.active ? "Arrêter" : "Démarrer"}
        </button>;
    }
}