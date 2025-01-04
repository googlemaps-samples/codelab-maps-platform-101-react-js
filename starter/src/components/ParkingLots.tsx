import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Define the Poi type
type Poi = {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
  name?: string; // Add this to store parking lot names
};

// ParkingLots component that fetches nearby parking lots
const ParkingLots = ({ userLocation }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [parkingLots, setParkingLots] = useState<Poi[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);

    const location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const request = {
      location,
      radius: 3000,
      type: 'parking',
    };

    svc.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const locations: Poi[] = results.map((lot) => ({
          key: lot.place_id,
          location: {
            lat: lot.geometry.location.lat(),
            lng: lot.geometry.location.lng(),
          },
          name: lot.name, // Store the parking lot name
        }));
        setParkingLots(locations);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  }, [placesLib, map]);

  return <PoiMarkers pois={parkingLots} />;
};

// Pop-Up Component
const Popup = ({ poi, onClose }) => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: '16px',
      zIndex: 1000,
    }}
  >
    <h3>{poi.name || 'Parking Lot'}</h3>
    <button onClick={() => console.log('Send notification clicked')}>Send Notification</button>
    <button onClick={() => console.log('Receive notification clicked')}>Receive Notifications</button>
    <button onClick={onClose}>Close</button>
  </div>
);

// PoiMarkers component to render the markers
const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  const handleClick = useCallback((poi: Poi) => {
    setSelectedPoi(poi);
  }, []);

  const setMarkerRef = (marker: google.maps.Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={() => handleClick(poi)}
        >
          <img src={'/public/images/parking_7723653.png'} width={34} height={34} title="Parking lots" />
        </AdvancedMarker>
      ))}
      {selectedPoi && <Popup poi={selectedPoi} onClose={() => setSelectedPoi(null)} />}
    </>
  );
};

export default ParkingLots;
