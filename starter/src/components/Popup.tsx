import React from 'react';

type PopupProps = {
  poi: { name?: string };
  onClose: () => void;
  onReceiveNotifications: () => void;
  onSendNotification: () => void;
};

const Popup: React.FC<PopupProps> = ({ poi, onClose, onReceiveNotifications, onSendNotification }) => (
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

export default Popup;
