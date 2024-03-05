import { useState, useMemo, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import Combobox from 'react-widgets/Combobox';

export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 50, lng: 25 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className='places-container'>
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap zoom={5} center={selected || center} mapContainerClassName='map-container'>
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async ({ place_id, description }) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({
      placeId: place_id,
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
      placeholder='Search an address'
      hideCaret
      hideEmptyPopup
      {...(status === 'OK' && { data: data })}
      dataKey='place_id'
      textField='description'
      onSelect={handleSelect}
    />
  );
};
