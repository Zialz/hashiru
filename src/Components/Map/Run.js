import React, { useEffect, useState, useRef } from 'react';
import mapboxgl, { clearPrewarmedResources } from 'mapbox-gl';
import { getdataDistance, getDistance } from 'geolib';




mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';


export function Map(props)  {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);


    const [isRunning, setIsRunning] = useState(false);
    const [lng, setLng] = useState(5);
    const [lat, setLat] = useState(34);
    const [zoom, setZoom] = useState(2);
    const [timer, setTimer] = useState();

    const [dataTimeSeconds, setdataTimeSeconds] = useState(0);
    const [displayTime, setDisplayTime] = useState();

    const [dataDistance, setDataDistance] = useState(0);
    const [displayDistance, setDisplayDistance] = useState(0);

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

        if(isRunning) {
            geojson.features[0].geometry.coordinates.length = 0;

            

        
            var coorddisplayTime = [];
            navigator.geolocation.watchPosition(data => { coorddisplayTime = [data.coords.longitude, data.coords.latitude]
            } );
            
            var timerID = window.setInterval(function () {
                var geojsonLength = geojson.features[0].geometry.coordinates.length;


                // Actualisation des coordonnées
                if(coorddisplayTime.length !==0 && coorddisplayTime != geojson.features[0].geometry.coordinates[geojsonLength-1]) {
                    geojson.features[0].geometry.coordinates.push(coorddisplayTime);
                    if(geojsonLength >= 1) {
                        var from =  {
                            latitude: geojson.features[0].geometry.coordinates[geojsonLength -1][1],
                            longitude: geojson.features[0].geometry.coordinates[geojsonLength -1][0],
                        };
                          var to =  {
                            latitude: geojson.features[0].geometry.coordinates[geojsonLength -0][1],
                            longitude: geojson.features[0].geometry.coordinates[geojsonLength -0][0],
                        };
                        var lastDist = getDistance(from,to);
                        setDataDistance(prevCount => prevCount + lastDist);
                    }
                }

                map.getSource('route').setData(geojson);

                // Actualisation du temps
                setdataTimeSeconds(prevCount => prevCount + 1000);

            }, 1000);

            setTimer(timerID);

        }
        else {
            window.clearInterval(timer)
        };
            
        

        if (!map) initializeMap({ setMap, mapContainer });


    }, [isRunning] );
        
    useEffect(() => {
        // Temps
        setDisplayTime(new Date(dataTimeSeconds).toISOString().substr(11, 8));

        // Distance
        setDisplayDistance(dataDistance/1000);

    },[dataTimeSeconds, dataDistance])
        
    return (
        <div>
            <div className='sidebarStyle'>
                <div>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Time : {displayTime} | Kilomètres : {displayDistance} km </div>
            </div>
            <div ref={el => mapContainer.current = el} className="mapContainer" />
            <div>
                <button onClick={() => {setIsRunning(!isRunning)}}>Démarrer</button>
            </div>
            

        </div>
    )
    
}
