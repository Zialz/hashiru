import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import {Button} from '../Button/Button.js'
mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';


export class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lng: 5,
            lat: 34,
            zoom: 2,
            active: false

        };

        this.isActive = this.isActive.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    isActive(buttonActive) {
        this.setState({active: buttonActive},this.componentDidMount)
    }

    componentDidMount() {
        const map=  new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        })
        map.on('move', () => {
            this.setState({
            lng: map.getCenter().lng.toFixed(4),
            lat: map.getCenter().lat.toFixed(4),
            zoom: map.getZoom().toFixed(2)
            });
        });
        
        var geojson = {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'LineString',
                  'coordinates': [
                    [4, 4]
                  ]
              }
            }
            ]
        };



        var coordonates = geojson.features[0].geometry.coordinates[0][0];
        this.setState({
          lng: coordonates
        });
        let active = this.state.active;

        console.log('oui'+active)
        map.on('load', function () {
            if(active) {
                map.addSource('route', {
                    'type': 'geojson',
                    'data': geojson
                });
        
                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                    },
                    'paint': {
                    'line-color': ' #ff29cb ',
                    'line-width': 4
                    }
                });
    
                
                var coordtest = [];
                navigator.geolocation.watchPosition(data => { coordtest = [data.coords.longitude, data.coords.latitude]
                } );
                
                var timer = window.setInterval(function () {
                    geojson.features[0].geometry.coordinates.push(coordtest);
                    map.getSource('route').setData(geojson);
                }, 1000);
            }
            
        });
    }


    
    render() {
        return (
            <div>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer" />
                <Button isActive = {this.isActive} />
                <h6>{this.state.active ? 'oui' : 'non'}</h6>
            </div>
        )
    }
}
