import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getDistance } from 'geolib';




mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';


export function Map() {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);


    const [running, setRunning] = useState(false);
    const [pause, setPause] = useState(false);
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
                center: [1, 46],
                zoom: 5
            })



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
                        'line-color': ' #dc3545 ',
                        'line-width': 4
                    }
                });

            });
        }


        if (!map) initializeMap({ setMap, mapContainer });


    }, [running]);


    // Algorithme de course
    useEffect(() => {
        if (running && !pause) {

            var coorddisplayTime = [];
            navigator.geolocation.watchPosition(data => {
                coorddisplayTime = [data.coords.longitude, data.coords.latitude]
            });

            var timerID = window.setInterval(function () {


                var geojsonLength = geojson.features[0].geometry.coordinates.length;

                // Actualisation de la distance et des coordonnées
                if (coorddisplayTime.length !== 0 && coorddisplayTime !== geojson.features[0].geometry.coordinates[geojsonLength - 1]) {
                    geojson.features[0].geometry.coordinates.push(coorddisplayTime);

                    if (geojsonLength >= 1) {
                        var from = {
                            latitude: geojson.features[0].geometry.coordinates[geojsonLength - 1][1],
                            longitude: geojson.features[0].geometry.coordinates[geojsonLength - 1][0],
                        };
                        var to = {
                            latitude: geojson.features[0].geometry.coordinates[geojsonLength - 0][1],
                            longitude: geojson.features[0].geometry.coordinates[geojsonLength - 0][0],
                        };
                        var lastDist = getDistance(from, to);
                        setDataDistance(prevCount => prevCount + lastDist);
                    }
                }

                // Actualisation du temps
                setdataTimeSeconds(prevCount => prevCount + 1000);

                map.getSource('route').setData(geojson);


            }, 1000);
            map.getSource('route').setData(geojson);

            setTimer(timerID);

        }
        else if (running && pause) {
            window.clearInterval(timer);
        }
        else if (!running) {
            // Sauvegarde de la course


            // Réinitialisation 
            window.clearInterval(timer)
            geojson.features[0].geometry.coordinates.length = 0;
            setPause(false);
            setdataTimeSeconds(0);
            setDataDistance(0);
        }
    }, [running, pause]);

    useEffect(() => {
        // Temps
        setDisplayTime(new Date(dataTimeSeconds).toISOString().substr(11, 8));

        // Distance
        setDisplayDistance(dataDistance / 1000);
    }, [dataTimeSeconds, dataDistance])

    return (
        <div>
            <div ref={el => mapContainer.current = el} className="mapContainer" />
            {!running &&
                <button className="btn btn-outline-danger m-1" onClick={() => { setRunning(!running) }}>Démarrer</button>
            }
            {running && !pause &&
                <div>
                    <button className="btn btn-outline-danger m-1" onClick={() => { setPause(!pause) }}>Mettre en pause</button>
                    <button className="btn btn-outline-danger m-1" onClick={() => { setRunning(!running) }}>Arrêter</button>
                </div>
            }
            {running && pause &&
                <div>
                    <button className="btn btn-outline-danger active m-1" onClick={() => { setPause(!pause) }}>Reprendre la course</button>
                    <button className="btn btn-outline-danger m-1" onClick={() => { setRunning(!running) }}>Arrêter</button>
                </div>
            }
            <div class="card">
                <div class="card-body p-3">
                    <ul class="fa-ul">
                        <li><span class="fa-li"><i class="fas fa-map-marker-alt"></i></span><p>Distance : {displayDistance} km</p></li>
                        <li><span class="fa-li"><i class="far fa-hourglass"></i></span><p>Durée : {displayTime}</p></li>
                    </ul>
                </div>
            </div>
        </div>
    )

}
