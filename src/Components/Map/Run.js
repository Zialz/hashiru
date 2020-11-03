import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { clearPrewarmedResources } from 'mapbox-gl';
import {Button} from '../Button/Button.js'
import { act } from 'react-dom/test-utils';


mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';


export function Map(props)  {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);


    const [active, setActive] = useState(false);
    const [lng, setLng] = useState(5);
    const [lat, setLat] = useState(34);
    const [zoom, setZoom] = useState(2);
    const [timer, setTimer] = useState();



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


    useEffect(() => {

        
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
              center: [lng, lat],
              zoom: zoom
            })
        


            
            map.on('move', () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });
            

            map.on('load', function () {
                setMap(map);
                map.resize();
                console.log("ici"+active)
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
            });
        }

        if(active) {
            geojson.features[0].geometry.coordinates.length = 0;

            

        
            var coordtest = [];
            navigator.geolocation.watchPosition(data => { coordtest = [data.coords.longitude, data.coords.latitude]
            } );
            
            var timerID = window.setInterval(function () {
                if(coordtest.length !==0) {
                    geojson.features[0].geometry.coordinates.push(coordtest);
                }
                
                map.getSource('route').setData(geojson);
            }, 1000);

            setTimer(timerID);

        }
        else {
            window.clearInterval(timer)
        };
            
        

        if (!map) initializeMap({ setMap, mapContainer });


    }, [active] );
        
        
        
    return (
        <div>
            <div className='sidebarStyle'>
                <div>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
            </div>
            <div ref={el => mapContainer.current = el} className="mapContainer" />
            <button onClick={() => {setActive(!active)}}>Activer</button>

        </div>
    )
    
}
