import React from 'react';
import {Line} from 'react-chartjs-2';
import source from '../../json/source.json';

const name = source.TrainingCenterDatabase.Activities.Activity.Sport;
const tracks = source.TrainingCenterDatabase.Activities.Activity.Lap.Track[0].Trackpoint;

const distance = [];
const time = [];
const fq = [];

let i = 20;
const setTime = tracks.map(s => {
  if (i == 20) {
    time.push(new Date(s.Time).toTimeString().split(' ')[0] + " - " + Math.round(s.DistanceMeters) + "m")
    i = 0;
  }
  i++;
});

i = 20;
const setFq = tracks.map(s => {
  if (i == 20) {
    fq.push(s.HeartRateBpm.Value)
    i = 0;
  }
  i++;
});

const data = {
  labels: time,
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
      pointRadius: 1,
      pointHitRadius: 10,
      data: fq
    }
  ]
};

const options = {
  scales: {
    xAxes: [{
      stacked: true
    }]
  }
}

export default function Graph() {


  return (
    <div>
      <h2>Sport: {name}</h2>
      <Line data={data} options={options} />
    </div>
  );
}