import React from "react";
import PhoneInput from "react-phone-input-2";

const ContactInfoSection = ({
  formState,
  updateFormState,
  errors,
  clearError,
  shouldDisableForm,
  isReadOnly,
  onPhoneChange,
  isCheckingDuplicate
}) => {
  const handleFieldChange = (field, value) => {
    updateFormState({ [field]: value });
    if (errors[field]) clearError(field);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters and spaces
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleFieldChange('agentName', value);
    }
  };

  return (
    <>
      <div className="col-xl-4 col-lg-6">
        <PhoneField
          value={formState.agentPhone}
          onChange={onPhoneChange}
          error={errors.agentPhone}
          isReadOnly={isReadOnly}
          shouldDisableForm={shouldDisableForm}
          isCheckingDuplicate={isCheckingDuplicate}
        />
      </div>

      <div className="col-xl-4 col-lg-6">
        <TextField
          label="Name*"
          value={formState.agentName}
          onChange={handleNameChange}
          error={errors.agentName}
          placeholder="Enter agent name"
          disabled={shouldDisableForm}
        />
      </div>

      <div className="col-xl-4 col-lg-6">
        <TextField
          label="Email"
          value={formState.agentEmail}
          onChange={(e) => handleFieldChange('agentEmail', e.target.value)}
          error={errors.agentEmail}
          placeholder="Enter agent email"
          disabled={shouldDisableForm}
        />
      </div>

      <div className="col-xl-4 col-lg-6">
        <TextField
          label="Company name"
          value={formState.agentCompanyName}
          onChange={(e) => handleFieldChange('agentCompanyName', e.target.value)}
          placeholder="Enter company name"
          disabled={shouldDisableForm}
        />
      </div>
      
      <div className="col-xl-4 col-lg-6">
        <TextField
          label="Pancard Number"
          value={formState.agentPancard}
          onChange={(e) => handleFieldChange('agentPancard', e.target.value.toUpperCase())}
          placeholder="Enter pancard number"
          maxLength={10}
          disabled={shouldDisableForm}
        />
      </div>
      
      <div className="col-xl-4 col-lg-6">
        <TextField
          label="GST Number"
          value={formState.agentGstNumber}
          onChange={(e) => handleFieldChange('agentGstNumber', e.target.value.toUpperCase())}
          placeholder="Enter GST number"
          minLength={15}
          maxLength={15}
          disabled={shouldDisableForm}
        />
      </div>
    </>
  );
};

const PhoneField = ({ value, onChange, error, isReadOnly, shouldDisableForm, isCheckingDuplicate }) => (
  <div className="form_field label_top">
    <label>Phone number*</label>
    <div className="form_field_inner">
      <PhoneInput
        country={"in"}
        onlyCountries={["in"]}
        countryCodeEditable={false}
        value={value}
        onChange={onChange}
        keyboardType="phone-pad"
        placeholder="mobile number"
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: false,
          maxLength: 15,
          readOnly: isReadOnly,
        }}
        inputStyle={{
          width: "100%",
          paddingLeft: "60px",
          fontSize: "16px",
          borderRadius: "12px",
          height: "45px",
          backgroundColor: (isReadOnly || shouldDisableForm) ? '#f5f5f5' : '#fff',
        }}
        buttonStyle={{
          borderRadius: "12px",
          textAlign: "left",
          border: "1px solid #00A8A8",
          backgroundColor: (isReadOnly || shouldDisableForm) ? '#f5f5f5' : '#fff',
        }}
      />
      {isCheckingDuplicate && (
        <div className="text-muted" style={{ fontSize: "12px", marginTop: "5px" }}>
          Checking availability...
        </div>
      )}
      {error && <div className="field_error">{error}</div>}
    </div>
  </div>
);

const TextField = ({ label, value, onChange, error, placeholder, disabled, maxLength, minLength }) => (
  <div className="form_field label_top">
    <label>{label}</label>
    <div className="form_field_inner">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        className={error ? 'error-border' : ''}
      />
      {error && <div className="field_error">{error}</div>}
    </div>
  </div>
);

export default ContactInfoSection;