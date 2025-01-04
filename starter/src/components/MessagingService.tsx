import twilio from 'twilio';
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from './FirebaseConfig'; // Replace with your Firebase config file

const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Sends SMS to all users subscribed to a parking lot.
 * @param {string} lotId - The ID of the parking lot.
 */
/**
 * Sends SMS to all users subscribed to a parking lot via the backend.
 * @param {string} lotId - The ID of the parking lot.
 */
export const sendNotification = async (lotId, message) => {
    try {
      const response = await fetch('http://localhost:3001/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lotId, message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
  
      const result = await response.json();
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  