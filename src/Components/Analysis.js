import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import mapboxgl from 'mapbox-gl';
import Slider from '@material-ui/core/Slider';
import "chartjs-plugin-annotation";
import "./Analysis.css";



mapboxgl.accessToken = 'pk.eyJ1Ijoicm90b3RvZ3JpbCIsImEiOiJja2Y1anFlYTAwbmxrMnlwOTZmNmd3OGxzIn0.wpkEfgXt-XFfU_yWUgx7BA';



export default function Analysis(props) {

  // Source provenant du composant Upload
  const [source, setSource] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    var comeSource = JSON.parse(props.history.location.state.data);
    setSource(comeSource);
    setIsLoaded(true);
  }, [props.history.location.state.data]);

  /*
   *
   * Map Display
   * 
   */

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

  var markers = {
    'type': 'FeatureCollection',
    'features': [
      {
        // Départ
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        },
        'properties': {
          'title': 'Début de la course'
        }
      },
      {
        // Arrivée
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [2, 2]
        },
        'properties': {
          'title': 'Fin de la course'
        }
      }
    ]
  }

  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [geojson, setGeojson] = useState(geojsondata);

  useEffect(() => {
    if (isLoaded) {
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

          map.addSource('parcours-points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [-121.415061, 40.506229]
                  }
                },
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [-121.505184, 40.488084]
                  }
                },
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [-121.354465, 40.488737]
                  }
                }
              ]
            }
          });

          map.addLayer({
            'id': 'points',
            'type': 'circle',
            'source': 'parcours-points',
            'paint': {
              'circle-radius': 6,
              'circle-color': '#18182F'
            }
          });
        });
      }
      if (!map) initializeMap({ setMap, mapContainer });
      if (map) fitBounds();

    }


  },[isLoaded, map, fitBounds, geojson]);

  // Initailisation du parcours
  if (isLoaded) {
    var tracks = source.TrainingCenterDatabase.Activities.Activity.Lap[0].Track[0].Trackpoint;

    tracks.forEach(s => {
      var cc = [parseFloat(s.Position.LongitudeDegrees._text), parseFloat(s.Position.LatitudeDegrees._text)];
      geojsondata.features[0].geometry.coordinates.push(cc);
    }); // Ajout des coordonnées du parcours à geojsondata

  }




  /*
   *
   * Graphs
   *
   */

  // Variables


  var distance = [];
  var time = [];
  var fq = [];
  var coords = [];
  const [value, setValue] = useState([0, 1000]);
  const [graph, setGraph] = useState(false);
  const [totalDist, setTotalDist] = useState(0);
  const [totalTime, setTotalTime] = useState();
  const [runStart, setRunStart] = useState();
  const [runEnd, setRunEnd] = useState();
  const chartContainer = useRef(null);


  if (isLoaded) {
    tracks.forEach(s => {
      distance.push(Math.round(s.DistanceMeters._text))
    });  // Initialisation du tableau de la distance

    tracks.forEach(s => {
      time.push(new Date(s.Time._text).toTimeString().split(' ')[0])
    });  // Initialisation du tableau du temps

    tracks.forEach(s => {
      fq.push(s.HeartRateBpm.Value._text)
    }); // Initialisation du tableau de la fréquence cardiaque
  }

  // Graphique complet --------------------------

  const fullDistance = [];
  const fullFq = [];
  if (isLoaded) {
    fq.forEach(f => {
      fullFq.push(f)
    }); // Initailisation de la fréquence cardiaque complète

    distance.forEach(d => {
      fullDistance.push(d)
    }); // Initailisation de la distance complète
  }

  // Mise à jour des données globales
  useEffect(() => {
    if (isLoaded) {
      setTotalDist(fullDistance[fullDistance.length - 1]);
      setRunStart(time[0]);
      setRunEnd(time[time.length - 1]);
      setTotalTime(time_diff(time[time.length - 1], time[0]));
    }
  },);

  // Calcul des moments
  const moments = [];
  if (isLoaded) {
    for (let j = 0; j < 3; j++) {
      let min = 1 + (fq.length / 3) * j;
      let max = (fq.length / 3) + ((fq.length / 3) * j);

      let actmin = 99999;
      let pos = "";
      for (let k = min; k < max; k++) {
        if (fq[k] < actmin) {
          actmin = fq[k];
          pos = k;
        }
      }
      moments.push(pos);
    }
  }

  var fullData = {
    labels: fullDistance,
    datasets: [
      {
        label: 'Fréquence cardiaque',

        fill: false,
        backgroundColor: 'rgba(210,0,0,0.4)',
        borderColor: 'rgba(255,0,0,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',

        pointBorderColor: 'rgba(210,0,0,0.4)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,

        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(210,0,0,0.4)',
        pointHoverBorderColor: 'rgba(255,0,0,1)',
        pointHoverBorderWidth: 2,

        pointRadius: 0,
        pointHitRadius: 10,

        data: fullFq
      }
    ]
  };

  let line = [];
  moments.forEach(m => line.push({
    type: 'line',
    mode: 'vertical',
    scaleID: 'x-axis-0',
    value: m,
    borderColor: '#2984c5',
    borderWidth: 2
  }));

  const options = {
    annotation: {
      annotations: line
    },
  };

  // Fin graphique complet --------------------------

  // Graphique adaptatif --------------------------

  var data = {
    labels: distance,
    datasets: [
      {
        label: 'Fréquence cardiaque',

        fill: false,
        backgroundColor: 'rgba(210,0,0,0.4)',
        borderColor: 'rgba(255,0,0,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',

        pointBorderColor: 'rgba(210,0,0,0.4)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,

        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(210,0,0,0.4)',
        pointHoverBorderColor: 'rgba(255,0,0,1)',
        pointHoverBorderWidth: 2,

        pointRadius: 0,
        pointHitRadius: 10,

        data: fq
      }
    ]
  };

  // A chaque changement des données du slider, on réactualise le graphique et les points sur la carte
  useEffect(() => {
    if (isLoaded) {
      fq = []
      tracks.forEach(s => {
        if (s.DistanceMeters._text < value[1] && s.DistanceMeters._text > value[0]) {
          fq.push(s.HeartRateBpm.Value._text)
        } // Mise à jour de la fréquence cardiaque
      });

      distance = []
      tracks.forEach(s => {
        if (s.DistanceMeters._text < value[1] && s.DistanceMeters._text > value[0]) {
          distance.push(Math.round(s.DistanceMeters._text))
        }
      }); // Mise à jour de la distance

      coords = []
      tracks.forEach(s => {
        var cc = [s.Position.LongitudeDegrees._text, s.Position.LatitudeDegrees._text];
        if (s.DistanceMeters._text < value[1] && s.DistanceMeters._text > value[0]) {
          coords.push(cc)
        }
      }); // Mise à jour de la position

      // Mise à jour des labels du graphique
      data.labels = distance;
      data.datasets[0].data = fq;

      // Récupération de la position de l'intervalle
      markers.features[0].geometry.coordinates = coords[0];
      markers.features[1].geometry.coordinates = coords[coords.length - 1];

      // Mise à jour sur la carte
      if (map) {
        map.getSource('parcours-points').setData(markers);
      }
    }
  });

  // Fin graphique adaptatif --------------------------


  useEffect(() => {
    if (map) setMapData();
  }, [map]); // Mise à jour de la carte lors du chargement des données

  /*
   *
   * Functions
   *
   */
  function fitBounds() {
    var coordinates = geojsondata.features[0].geometry.coordinates;
    var bounds = coordinates.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.fitBounds(bounds, {
      padding: 20
    });
  };

  function setMapData() {
    setGeojson(geojsondata);
    map.getSource('route').setData(geojson);
  }

  function time_diff(t1, t2) {
    var parts = t1.split(':');
    var d1 = new Date(0, 0, 0, parts[0], parts[1], parts[2]);
    parts = t2.split(':');
    var d2 = new Date(new Date(0, 0, 0, parts[0], parts[1], parts[2]) - d1);
    if (d2.getHours() !== 0) return (d2.getHours() + ':' + d2.getMinutes() + ':' + d2.getSeconds());
    return (d2.getMinutes() + ':' + d2.getSeconds());
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  

  /*
   *
   * Render
   *
   */

  if (!isLoaded) {
    return (<div><p>Loading...</p></div>)
  }

  return (
    <div className="px-5 pb-2">
      <div ref={el => mapContainer.current = el} className="mapContainer border border-danger  my-2" />
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-white">
            <h5 className="card-header">Résumé du parcours</h5>
            <div class="card-body p-3">
              <ul class="fa-ul">
                <li><span class="fa-li"><i class="fas fa-map-marker-alt"></i></span><p>Distance : {totalDist / 1000} km</p></li>
                <li><span class="fa-li"><i class="far fa-hourglass"></i></span><p>Durée : {totalTime}</p></li>
                <li><span class="fa-li"><i class="fas fa-clock"></i></span><p>Heure de départ : {runStart}</p></li>
                <li><span class="fa-li"><i class="far fa-clock"></i></span><p>Heure d'arrivée : {runEnd}</p></li>

              </ul>
              <button onClick={() => fitBounds()} className="btn btn-outline-danger m-1">Recentrer</button>
            </div>
          </div>
        </div>

        <div class="col-md-8 ">
          {graph &&
            <div class="card">
              <div class="card-body p-3">
                <button onClick={() => { setGraph(false) }} className="btn btn-outline-danger m-1">Tout le parcours</button>
                <button onClick={() => { setGraph(true) }} className="btn btn-outline-danger m-1 active">Portion du parcours</button>
                <p>Choisir la portion de parcours sur laquelle vous voulez analyser la FQ : </p>
                <Slider
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={(distance[distance.length - 1])}
                  className="slider"
                />
                <Line ref={el => chartContainer.current = el} redraw data={data} />
              </div>
            </div>
          }
          {!graph &&
            <div class="card ">

              <div class="card-body p-3">
                <button onClick={() => { setGraph(false) }} className="btn btn-outline-danger m-1 active">Tout le parcours</button>
                <button onClick={() => { setGraph(true) }} className="btn btn-outline-danger m-1">Portion du parcours</button>
                <Line ref={el => chartContainer.current = el} data={fullData} options={options} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}