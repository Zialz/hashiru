import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getDistance } from 'geolib';




mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';


export function Map(props)  {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);


    const [running, setRunning] = useState(false);
    const [pause, setPause] = useState(false);
    const [lng, setLng] = useState(5);
    const [lat, setLat] = useState(34);
    const [zoom, setZoom] = useState(2);
    const [timer, setTimer] = useState(); 

    const [dataTimeSeconds, setdataTimeSeconds] = useState(0);
    const [displayTime, setDisplayTime] = useState();

    const [dataDistance, setDataDistance] = useState(0);
    const [displayDistance, setDisplayDistance] = useState(0);

    var geojsondata = {
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


    const [geojson, setGeojson] = useState(geojsondata);


    // Initialisation de la map
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
                    'line-cap': 'round',
                    },
                    'paint': {
                    'line-color': ' #ff29cb ',
                    'line-width': 4
                    }
                });

            });
        }

        
        if (!map) initializeMap({ setMap, mapContainer });


    }, [running] );
    

    // Algorithme de course
    useEffect(() => {
        if(running && !pause) {
            
            var coorddisplayTime = [];
            navigator.geolocation.watchPosition(data => { coorddisplayTime = [data.coords.longitude, data.coords.latitude]
            } );
            
            var timerID = window.setInterval(function () {
            var geojsonLength = geojson.features[0].geometry.coordinates.length;


                // Actualisation de la distance et des coordonnées
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

                // Actualisation du temps
                setdataTimeSeconds(prevCount => prevCount + 1000);

                map.getSource('route').setData(geojson);
                //map.setLayoutProperty('route','visibility','none');


            }, 1000);
            map.getSource('route').setData(geojson);

            setTimer(timerID);

        }
        else if(running && pause) {
            window.clearInterval(timer);
        }
        else if(!running) {
             // Sauvegarde de la course
             

             // Réinitialisation 
             window.clearInterval(timer)
             geojson.features[0].geometry.coordinates.length = 0;
             setPause(false);
             setdataTimeSeconds(0);
             setDataDistance(0);
        }
    },[running,pause]);
    
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
            {!running &&
                <button onClick={() => {setRunning(!running)}}>Démarrer</button>
            }
            {running &&
                <div>
                    <button onClick={() => {setPause(!pause)}}>Pause</button>
                    <button onClick={() => {setRunning(!running)}}>Arrêter</button>
                </div>
            }
            

        </div>
    )
    
}
