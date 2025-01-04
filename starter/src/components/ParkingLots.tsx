import { AdvancedMarker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Popup from "./PopupComponent";

// Poi type definition
type Poi = {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
};

const ParkingLots = ({ userLocation }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [parkingLots, setParkingLots] = useState<Poi[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);
    const location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const request = {
      location,
      radius: 3000,
      type: "parking",
    };

    svc.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const locations: Poi[] = results.map((lot) => ({
          key: lot.place_id,
          location: {
            lat: lot.geometry.location.lat(),
            lng: lot.geometry.location.lng(),
          },
        }));
        setParkingLots(locations);
      } else {
        console.error("Nearby search failed:", status);
      }
    });
  }, [placesLib, map]);

  return <PoiMarkers pois={parkingLots} />;
};

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const placesLib = useMapsLibrary("places");

  const handleClick = useCallback((poi: Poi, ev: google.maps.MapMouseEvent) => {
    if (!map || !placesLib) return;
    if (!ev.latLng) return;

    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);

    const clickedLatLng = ev.latLng;

    // Fetch the place details using placeDetails API
    const svc = new placesLib.PlacesService(map);
    const request = {
      placeId: poi.key, // Use poi.key (place_id) from the clicked marker
    };

    svc.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const name = place.name || "Unknown Place"; // Get the name of the parking lot
        const selectedPoi = {
          name,
          key: place.place_id,
          latLng: clickedLatLng,
        };

        setSelectedPoi(selectedPoi);
        setShowPopup(true);
      } else {
        console.error("Place details request failed:", status);
      }
    });
  }, [map, placesLib]);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

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
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev) => handleClick(poi, ev)} // Pass poi and event to the handler
        >
          <img
            src={"/public/images/parking_7723653.png"}
            width={34}
            height={34}
            title="Parking lots"
          />
        </AdvancedMarker>
      ))}
      {showPopup && selectedPoi && (
        <Popup poi={selectedPoi} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default ParkingLots;
