import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig'; // Adjust the path if needed

const Popup = ({ poi, onClose }: { poi: any; onClose: () => void }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleReceiveNotifications = () => {
    setInputVisible(true);
  };

  const handlePhoneNumberSubmit = async () => {
    if (!phoneNumber) {
      alert('Please enter a valid phone number.');
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), {
        phoneNumber,
        parkingLot: {
          id: poi.key,
          name: poi.name || 'Unknown Parking Lot',
          location: poi.location,
        },
        timestamp: new Date(),
      });
      alert('You will receive notifications for this parking lot!');
      setInputVisible(false);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('Failed to save. Please try again.');
    }
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
      <h3>{poi.name || 'Parking Lot'}</h3>
      <button onClick={() => console.log('Send notification clicked')}>Send Notification</button>
      <button onClick={handleReceiveNotifications}>Receive Notifications</button>
      {isInputVisible && (
        <div>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ margin: '8px 0', padding: '8px', width: '100%' }}
          />
          <button onClick={handlePhoneNumberSubmit} style={{ padding: '8px', width: '100%' }}>
            Submit
          </button>
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Popup;
