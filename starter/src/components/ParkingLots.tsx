import { AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useState,useRef, useCallback } from 'react';
// import { Circle } from './circle';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Define the Poi type
type Poi = {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
};

// ParkingLots component that fetches nearby parking lots
const ParkingLots = ({userLocation}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [parkingLots, setParkingLots] = useState<Poi[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);

    // Define the location (latitude and longitude)
    const location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng); // Example: New York City (lat, lng)
    const request = {
      location,
      radius: 1000, // Search within 500 meters
      type: 'parking', // Search for parking lots
    };

    // Perform the nearby search
    svc.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Map the results to create the array of locations
        const locations: Poi[] = results.map((lot, index) => ({
          key: lot.place_id, // You can use a unique property like place_id as the key
          location: {
            lat: lot.geometry.location.lat(),
            lng: lot.geometry.location.lng(),
          },
        }));
        
        setParkingLots(locations); // Store the locations in the state
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  }, [placesLib, map]);

  return (
      <PoiMarkers pois={parkingLots} />
  );
};
//push to server
// PoiMarkers component to render the markers
const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(null);

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if (!map) return;
    if (!ev.latLng) return;
    console.log('Marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
  });

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers when the markers array changes
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

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
      {/* <Circle
        radius={800}
        center={circleCenter}
        strokeColor="#0c4cb3"
        strokeOpacity={1}
        strokeWeight={3}
        fillColor="#3b82f6"
        fillOpacity={0.3}
      /> */}
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleClick}
        >
          <img src={'/images/parking_7723653.png'} width={34} height={34} title="Parking lots" />

        </AdvancedMarker>
      ))}
    </>
  );
};

export default ParkingLots;