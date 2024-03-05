import { Combobox } from 'react-widgets';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

export const PlacesAutocomplete = ({ placeholder, setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  console.log(data);

  const handleSelect = async (address) => {
    console.log(address);
    setValue(address.description, false);
    clearSuggestions();

    const results = await getGeocode({
      placeId: address.place_id,
    });
    const { lat, lng } = await getLatLng(results[0]);
    console.log(lat, lng);
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
