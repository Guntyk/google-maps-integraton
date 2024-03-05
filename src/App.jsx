import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { PlacesAutocomplete } from './PlacesAutocomplete';

export default function ClubRegistration() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const center = { lat: 49.4065, lng: 30.613 };
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    console.log(coords);
  }, [coords]);

  return isLoaded ? (
    <main className='main'>
      <section className='club-reg'>
        <h1>Search</h1>
        <PlacesAutocomplete placeholder='Address' setSelected={setCoords} />
      </section>
      <GoogleMap zoom={7} center={coords || center} mapContainerClassName='map-container'>
        {coords && <Marker position={coords} />}
      </GoogleMap>
    </main>
  ) : (
    <div>Loading...</div>
  );
}
