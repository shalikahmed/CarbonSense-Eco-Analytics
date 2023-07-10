import React, { useRef, useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';

const center = { lat: 48.8584, lng: 2.2945 };

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB4JnT3stxfjIyYFdvbRUhNUbmzBhO41O8",
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const originRef = useRef();
  const destinationRef = useRef();

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div>
      <div>
        <Autocomplete>
          <input type="text" placeholder="Origin" ref={originRef} />
        </Autocomplete>
      </div>
      <div>
        <Autocomplete>
          <input type="text" placeholder="Destination" ref={destinationRef} />
        </Autocomplete>
      </div>
      <button onClick={calculateRoute}>Calculate Route</button>
      <button onClick={clearRoute}>Clear Route</button>
      {directionsResponse && (
        <div>
          <div>Distance: {distance}</div>
          <div>Duration: {duration}</div>
        </div>
      )}
      {isLoaded && (
        <GoogleMap center={center} zoom={15} onLoad={map => setMap(map)}>
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
