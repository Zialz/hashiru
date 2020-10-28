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
                    
                  ]
              }
            }
            ]
        };




        let active = this.state.active;

        console.log('oui'+active)
        map.on('load', function () {
            if(active) {
                
                // geojson.features[0].geometry.coordinates.length = 0;
                // var options = {timeout:60000};
                // navigator.geolocation.getCurrentPosition(
                // data => {
                //      var coordPush1 = [data.coords.longitude, data.coords.latitude];
                //      console.log("GCP : "+coordPush1[0]);
                //      geojson.features[0].geometry.coordinates.push(coordPush1); 
                // },
                // err => {
                //     if(err.code == 1) {
                //         alert("Error: Access is denied!");
                //      } 
                //      else if( err.code == 2) {
                //         alert("Error: Position is unavailable!");
                //      }
                // },
                // options
                // );
                geojson.features[0].geometry.coordinates.length = 0;
                
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
                    if(coordtest.length !==0) {
                        geojson.features[0].geometry.coordinates.push(coordtest);
                    }
                    
                    map.getSource('route').setData(geojson);
                    console.log(geojson)
                }, 1000);

                this.setState({timerID: timer})
            }
            else {
                window.clearInterval(this.state.timerID)
            }
        }.bind(this));


        
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
