import React, { useState } from "react";
import SubscribeForm from "./SubscribeForm"; // Adjust the path as needed
import { sendNotification } from "./MessagingService"; // Import the notification logic

const Popup = ({ poi, onClose }) => {
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);

  // const handleSendNotification = async () => {
  //   const lotId = poi.key; // Use the actual lot ID from the `poi` object
  //   const message = 'Your car is being booted!';

  //   try {
  //     await sendNotification(lotId, message);
  //     alert('Notification sent successfully!');
  //   } catch (error) {
  //     console.error('Failed to send notification:', error);
  //     alert('Failed to send notification.');
  //   }
  // };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <h3>{poi.name || "Parking Lot"}</h3>
      {/* {showSubscribeForm ? (
        <SubscribeForm lotId={poi.key} onClose={() => setShowSubscribeForm(false)} />
      ) : (
        <>
          <button onClick={handleSendNotification}>Send Notification</button>
          <button onClick={() => setShowSubscribeForm(true)}>Receive Notifications</button>
          <button onClick={onClose}>Close</button>
        </>
      )} */}
    </div>
  );
};

export default Popup;
