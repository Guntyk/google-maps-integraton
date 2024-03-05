import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';
import { Combobox } from 'react-widgets';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

export default function ClubRegistration() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [address, setAddress] = useState(null);

  const fields = ['Country', 'Region', 'Town', 'Address'];

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <section className='club-reg'>
      <h1>Register your club</h1>
      <div className='inputs'>
        {fields.map((field) => (
          <PlacesAutocomplete placeholder={field} setSelected={setAddress} />
        ))}
      </div>
      <GoogleMap />
    </section>
  );
}

const PlacesAutocomplete = ({ placeholder, setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    console.log(address);
    setValue(address.description, false);
    clearSuggestions();

    const results = await getGeocode({
      placeId: address.place_id,
    });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox
      value={value}
      onChange={(e) => setValue(e)}
      disabled={!ready}
      className='combobox-input'
      placeholder={placeholder}
      hideCaret
      hideEmptyPopup
      {...(status === 'OK' && { data: data })}
      dataKey='place_id'
      textField='description'
      onSelect={handleSelect}
    />
  );
};
