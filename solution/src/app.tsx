/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from '@vis.gl/react-google-maps';

import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';

import {Circle} from './components/circle'

type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
  {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
  {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
  {key: 'hyderPark',  location: { lat: -33.8690081, lng: 151.2052393 }},
  {key: 'theRocks',   location: { lat: -33.8587568, lng: 151.2058246 }},
  {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
  {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
  {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
  {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
  {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
  {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
  {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
  {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
  {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
  {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
];

const App = () => (
  <APIProvider apiKey={'Your API key here'} onLoad={() => console.log('Maps API has loaded.')}>
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
      onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }
      mapId='da37f3254c6a6d1c'
      >
    <PoiMarkers pois={locations} />
    </Map>
  </APIProvider>
);

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null)
  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked: ', ev.latLng.toString());
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
  });
  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <Circle
          radius={800}
          center={circleCenter}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
        />
      {props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleClick}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default App;

const root = createRoot(document.getElementById('app'));
root.render(
      <App />
  );

