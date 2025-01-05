import React, { useEffect, useState } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { getDatabase, ref, push, set } from 'firebase/database';
import firebaseApp from './firebaseConfig'; // Import the initialized Firebase app
import Popup from './Popup';
import PhoneNumberPopup from './PhoneNumberPopup';
import axios from 'axios';

const database = getDatabase(firebaseApp);

// Rest of the code...


// Twilio configuration
const TWILIO_URL = "http://localhost:3000/send-sms";

// Define the Poi type
type Poi = {
  key: string;
  location: { lat: number; lng: number };
  name?: string;
};

const ParkingLots = ({ userLocation }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [parkingLots, setParkingLots] = useState<Poi[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);
    const location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const request = { location, radius: 3000, type: 'parking' };

    svc.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const locations: Poi[] = results.map((lot) => ({
          key: lot.place_id,
          location: {
            lat: lot.geometry.location.lat(),
            lng: lot.geometry.location.lng(),
          },
          name: lot.name,
        }));
        setParkingLots(locations);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  }, [placesLib, map]);

  const handlePhoneSave = (phoneNumber: string) => {
    if (selectedPoi) {
      const timestamp = new Date().toISOString();
      const phoneData = {
        phoneNumber,
        parkingLot: selectedPoi.name || 'Unknown',
        timestamp,
      };

      const newPhoneRef = push(ref(database, 'phoneNumbers'));
      set(newPhoneRef, phoneData)
        .then(() => alert('Phone number saved successfully!'))
        .catch((error) => console.error('Error saving phone number:', error));
    }
  };

  const handleSendNotification = () => {
    if (selectedPoi) {
      const payload = { parkingLot: selectedPoi.name || 'Unknown' };

      axios
        .post(TWILIO_URL, payload)
        .then(() => alert('Notification sent successfully!'))
        .catch((error) => console.error('Error sending notification:', error));
    }
  };

  return (
    <>
      {parkingLots.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable
          onClick={() => setSelectedPoi(poi)}
        >
          <img src={'/images/parking_7723653.png'} width={34} height={34} title="Parking lots" />
        </AdvancedMarker>
      ))}
      {selectedPoi && (
        <Popup
          poi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
          onReceiveNotifications={() => setShowPhonePopup(true)}
          onSendNotification={handleSendNotification}
        />
      )}
      {showPhonePopup && (
        <PhoneNumberPopup
          onSave={handlePhoneSave}
          onClose={() => setShowPhonePopup(false)}
        />
      )}
    </>
  );
};

export default ParkingLots;
