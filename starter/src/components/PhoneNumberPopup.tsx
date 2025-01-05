import React, { useState } from 'react';

type PhoneNumberPopupProps = {
  onSave: (phoneNumber: string) => void;
  onClose: () => void;
};

const PhoneNumberPopup: React.FC<PhoneNumberPopupProps> = ({ onSave, onClose }) => {
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

export default PhoneNumberPopup;
