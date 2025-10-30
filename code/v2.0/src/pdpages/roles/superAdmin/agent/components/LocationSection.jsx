import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";

const LocationSection = ({
  formState,
  updateFormState,
  masterData,
  errors,
  clearError,
  shouldDisableForm
}) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [societyOptions, setSocietyOptions] = useState([]);

  const { masterState, masterCity, masterLocality, masterSociety } = masterData;

  const citiesByState = useCallback(() => {
    const map = new Map();
    if (masterCity) {
      masterCity.forEach(city => {
        if (!map.has(city.state)) {
          map.set(city.state, []);
        }
        map.get(city.state).push(city);
      });
    }
    return map;
  }, [masterCity]);

  const localitiesByCity = useCallback(() => {
    const map = new Map();
    if (masterLocality) {
      masterLocality.forEach(locality => {
        if (!map.has(locality.city)) {
          map.set(locality.city, []);
        }
        map.get(locality.city).push(locality);
      });
    }
    return map;
  }, [masterLocality]);

  const societiesByLocality = useCallback(() => {
    const map = new Map();
    if (masterSociety) {
      masterSociety.forEach(society => {
        if (!map.has(society.locality)) {
          map.set(society.locality, []);
        }
        map.get(society.locality).push(society);
      });
    }
    return map;
  }, [masterSociety]);

  const formatOptionLabelWithCheck = ({ label, value }, { isSelected }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isSelected && (
        <span 
          className="material-symbols-outlined" 
          style={{ 
            fontSize: '18px', 
            marginRight: '8px', 
            color: 'var(--theme-green)',
            fontWeight: 'bold'
          }}
        >
          check
        </span>
      )}
      {label}
    </div>
  );

  const handleStateChange = useCallback((option) => {
    updateFormState({ 
      state: option,
      city: null,
      locality: [],
      society: []
    });
    clearError('state');

    if (option) {
      const cities = citiesByState().get(option.value) || [];
      const cityOptions = cities.map(city => ({
        label: city.city,
        value: city.id,
      }));
      setCityOptions(cityOptions);
    } else {
      setCityOptions([]);
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  }, [updateFormState, clearError, citiesByState]);

  const handleCityChange = useCallback((option) => {
    updateFormState({ 
      city: option,
      locality: [],
      society: []
    });
    clearError('city');

    if (option) {
      const localities = localitiesByCity().get(option.value) || [];
      const localityOptions = localities.map(locality => ({
        label: locality.locality,
        value: locality.id,
      }));
      setLocalityOptions(localityOptions);
      setSocietyOptions([]);
    } else {
      setLocalityOptions([]);
      setSocietyOptions([]);
    }
  }, [updateFormState, clearError, localitiesByCity]);

  const handleLocalityChange = useCallback((selectedOptions) => {
    updateFormState({ 
      locality: selectedOptions || [],
      society: []
    });

    if (selectedOptions && selectedOptions.length > 0) {
      const localityIds = selectedOptions.map(option => option.value);
      const allSocieties = [];

      localityIds.forEach(localityId => {
        const societies = societiesByLocality().get(localityId) || [];
        societies.forEach(society => {
          const localityObj = selectedOptions.find(loc => loc.value === society.locality);
          const localityName = localityObj ? localityObj.label : "";
          
          allSocieties.push({
            label: `${society.society}, ${localityName}`,
            value: society.id,
            localityId: society.locality
          });
        });
      });

      setSocietyOptions(allSocieties);
    } else {
      setSocietyOptions([]);
    }
  }, [updateFormState, societiesByLocality]);

  const handleSocietyChange = useCallback((selectedOptions) => {
    updateFormState({ society: selectedOptions || [] });
  }, [updateFormState]);

  const stateOptions = masterState ? masterState.map((stateData) => ({
    label: stateData.state,
    value: stateData.id,
  })) : [];

  return (
    <>
      <div className="col-xl-4 col-lg-6">
        <div className="form_field label_top">
          <label htmlFor="">State*</label>
          <div className="form_field_inner">
            <Select
              className="custom-select-stage1"
              onChange={handleStateChange}
              options={stateOptions}
              value={formState.state}
              isDisabled={shouldDisableForm}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  outline: "none",
                  background: shouldDisableForm ? '#f5f5f5' : '#eee',
                  borderBottom: " 1px solid var(--theme-blue)",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                  position: 'absolute',
                }),
                menuPortal: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
                container: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
            {errors.state && (
              <div className="field_error">{errors.state}</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-6">
        <div className="form_field label_top">
          <label htmlFor="">City*</label>
          <div className="form_field_inner">
            <Select
              onChange={handleCityChange}
              options={cityOptions}
              value={formState.city}
              isDisabled={!formState.state || shouldDisableForm}
              placeholder={formState.state ? "Select City" : "First select State"}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  outline: "none",
                  background: shouldDisableForm ? '#f5f5f5' : '#eee',
                  borderBottom: " 1px solid var(--theme-blue)",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                  position: 'absolute',
                }),
                menuPortal: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
                container: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
            {errors.city && (
              <div className="field_error">{errors.city}</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-6">
        <div className="form_field label_top">
          <label htmlFor="">Locality</label>
          <div className="form_field_inner">
            <Select
              isMulti
              onChange={handleLocalityChange}
              options={localityOptions}
              value={formState.locality}
              isDisabled={!formState.city || shouldDisableForm}
              placeholder={formState.city ? "Select Locality" : "First select City"}
              formatOptionLabel={formatOptionLabelWithCheck}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  outline: "none",
                  background: shouldDisableForm ? '#f5f5f5' : '#eee',
                  borderBottom: " 1px solid var(--theme-blue)",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                  position: 'absolute',
                }),
                menuPortal: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
                container: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-6">
        <div className="form_field label_top">
          <label htmlFor="">Society</label>
          <div className="form_field_inner">
            <Select
              isMulti
              onChange={handleSocietyChange}
              options={societyOptions}
              value={formState.society}
              isDisabled={formState.locality.length === 0 || shouldDisableForm}
              placeholder={formState.locality.length > 0 ? "Select Society" : "First select Locality"}
              formatOptionLabel={formatOptionLabelWithCheck}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  outline: "none",
                  background: shouldDisableForm ? '#f5f5f5' : '#eee',
                  borderBottom: " 1px solid var(--theme-blue)",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                  position: 'absolute',
                }),
                menuPortal: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
                container: (baseStyles) => ({
                  ...baseStyles,
                  zIndex: 999,
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSection;