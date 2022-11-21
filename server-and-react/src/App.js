import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import socketIO from 'socket.io-client';

import Map from "./Map/Map";
import Layers from "./Layers/Layers";
import TileLayer from "./Layers/TileLayer";
import VectorLayer from "./Layers/VectorLayer";
import osm from "./Source/osm";
import vector from "./Source/vector";
import { fromLonLat } from 'ol/proj';
import Controls from "./Controls/Controls";
import FullScreenControl from "./Controls/FullScreenControl";


const socket = socketIO.connect('http://localhost:4000');


function App() {

  const [center, setCenter] = useState([20, 48]);
  const [zoom, setZoom] = useState(20);

  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);


  const getBoatData = async () => {
    const res = await axios.get('http://localhost:4000/api/boatdata')
    console.log(res.data)
  }

  const getBoatRoute = async (routeId) => {
    await axios.get(`http://localhost:4000/getCoordinates/${routeId}`)
  }

  const getRandomPos = () => {
    var randomNumb = Math.random() * 100
    setCenter([randomNumb, randomNumb])
  }

  useEffect(()=>{
    setData([...data, [+center[0], +center[1]]])
  }, [center])



  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', async (message) => {
      var coords = await JSON.parse(message)
      setCenter([+coords.lon, +coords.lat])
    }, [])

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);


  return (
    <div>
      <p>Connected to to Coordinate provider server: {'' + isConnected}</p>
      <button onClick={getBoatData} >Get Saved Boat Coordinates</button>
      <button onClick={getRandomPos} >Go to random position</button>
      <button onClick={() => { getBoatRoute(1) }} >Get Route 1</button>
      <button onClick={() => { getBoatRoute(2) }} >Get Route 2</button>
      <button onClick={() => { getBoatRoute(3) }} >Get Route 3</button>
      <div>Current Boat position: lon: {center[0]} lat: {center[1]}</div>
      <div>
        <Map center={fromLonLat(center)} zoom={zoom}>
          <Layers>
            <TileLayer
              source={osm()}
              zIndex={0}
            />
          </Layers>
          <Controls>
            <FullScreenControl />
          </Controls>
        </Map>
      </div>


    </div>
  );
}

export default App;
