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

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

import { Circle } from "./components/circle";
import ParkingLots from "./components/ParkingLots";
import NoLocationFound from "./components/NoLocationFound";



type Poi = { key: string; location: google.maps.LatLngLiteral };

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  // Get the user's current location using geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  return (
    <APIProvider
      apiKey={"AIzaSyCeXIbYlLppTcbSrZwli8SaO6vBYrA35PQ"}
      library={["places"]}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      {userLocation ? (
        <Map
          defaultZoom={13}
          defaultCenter={userLocation}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          }
          mapId="da37f3254c6a6d1c"
        >
          <AdvancedMarker position={userLocation}>
            <img src={'/images/pin_8668861.png'} width={34} height={34} title="Current Location" />
          </AdvancedMarker>
          {/* load marking lots */}
          <ParkingLots userLocation={userLocation} />

          {/* <PoiMarkers pois={locations} /> */}
        </Map>
      ) : (
        <NoLocationFound />
      )}
    </APIProvider>
  );
};

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
