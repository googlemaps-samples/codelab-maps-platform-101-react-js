import { AdvancedMarker } from '@vis.gl/react-google-maps';
import React, { useState, useCallback } from 'react';
import Popup from './Popup';

interface Poi {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
}

const PoiMarkers = (props: { pois: Poi[] }) => {
  const { pois } = props;  // Destructure pois from the props
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  const handleMarkerClick = useCallback((poi: Poi) => {
    setSelectedPoi(poi);
  }, []);

  return (
    <>
      {pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          onClick={() => handleMarkerClick(poi)}
        >
          <img
            src={'/public/images/parking_7723653.png'}
            width={34}
            height={34}
            alt="Parking lot marker"
          />
        </AdvancedMarker>
      ))}
      {selectedPoi && <Popup poi={selectedPoi} onClose={() => setSelectedPoi(null)} />}
    </>
  );
};

export default PoiMarkers;
