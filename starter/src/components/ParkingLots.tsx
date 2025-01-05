import React, { useEffect, useState, useCallback } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import axios from 'axios';

// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyAYGCeiwywP5LveenGYeDH6GfR181c2st0",
  authDomain: "bootwatcher-82f5d.firebaseapp.com",
  databaseURL: "https://bootwatcher-82f5d-default-rtdb.firebaseio.com/",
  projectId: "bootwatcher-82f5d",
  storageBucket: "bootwatcher-82f5d.firebasestorage.app",
  messagingSenderId: "1007091338240",
  appId: "1:1007091338240:web:f8d830cc8a4e05b3e55ce5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define the Poi type
type Poi = {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
  name?: string;
};

// Twilio configuration (Local server for testing)
const TWILIO_URL = "http://localhost:3000/send-sms";

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
          name: lot.name,
        }));
        setParkingLots(locations);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  }, [placesLib, map]);

  return <PoiMarkers pois={parkingLots} />;
};

// Popup Component
const Popup = ({ poi, onClose, onReceiveNotifications, onSendNotification }) => (
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
    <button onClick={onReceiveNotifications}>Receive Notifications</button>
    <button onClick={onSendNotification}>Send Notification</button>
    <button onClick={onClose}>Close</button>
  </div>
);

// Phone Number Input Popup
const PhoneNumberPopup = ({ onSave, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSave = () => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust for international numbers if needed
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid phone number.');
      return;
    }
    onSave(phoneNumber);
    onClose();
  };

  return (
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
      <h3>Enter Your Phone Number</h3>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Your phone number"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

// PoiMarkers component to render the markers
const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const handleClick = useCallback((poi: Poi) => {
    setSelectedPoi(poi);
  }, []);

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
        .then(() => {
          console.log('Phone number saved successfully');
        })
        .catch((error) => {
          console.error('Error saving phone number:', error);
        });
    }
  };

  const handleSendNotification = () => {
    if (selectedPoi) {
      const phoneNumbersRef = query(ref(database, 'phoneNumbers'), orderByChild('parkingLot'), equalTo(selectedPoi.name || 'Unknown'));

      get(phoneNumbersRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const phoneNumbers = Object.values(data).map((entry: any) => entry.phoneNumber);

          axios.post(TWILIO_URL, {
            message: `Notification from ${selectedPoi.name || 'Parking Lot'}`,
            phoneNumbers,
          })
          .then(() => {
            alert('Notification sent successfully!');
          })
          .catch((error) => {
            console.error('Error sending notification:', error);
          });
        } else {
          alert('No phone numbers found for this parking lot.');
        }
      }).catch((error) => {
        console.error('Error fetching phone numbers:', error);
      });
    }
  };

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
      {selectedPoi && (
        <>
          <Popup
            poi={selectedPoi}
            onClose={() => setSelectedPoi(null)}
            onReceiveNotifications={() => setShowPhonePopup(true)}
            onSendNotification={handleSendNotification}
          />
        </>
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
