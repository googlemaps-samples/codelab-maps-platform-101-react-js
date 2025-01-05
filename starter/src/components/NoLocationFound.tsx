import React from 'react';

// NoLocationFound component to display when no locations are found
const NoLocationFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2d3748',
          }}
        >
          No Parking Lots Found
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#4a5568',
            marginTop: '8px',
          }}
        >
          We're sorry, but we couldn't find any nearby parking lots at the moment. Please try again later or adjust your search criteria.
        </p>
      </div>
    </div>
  );
};

export default NoLocationFound;
