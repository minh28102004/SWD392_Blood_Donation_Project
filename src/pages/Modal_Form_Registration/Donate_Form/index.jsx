// DonateForm.jsx
import React from "react";
import {
  FormRow,
  InputField,
  SelectField,
  TextAreaField,
} from "@pages/Modal_Form_Registration/Form_Build/FormBuild";

const DonateForm = ({ onChange }) => (
  <>
    <FormRow columns={2}>
      <InputField
        label="Full Name"
        name="fullName"
        onChange={onChange}
        required
      />
      <InputField
        label="Age"
        name="age"
        type="number"
        min="18"
        max="65"
        onChange={onChange}
        required
      />
    </FormRow>
    <FormRow columns={2}>
      <SelectField
        label="Blood Type"
        name="bloodType"
        options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
        onChange={onChange}
        required
      />
      <SelectField
        label="Blood Component"
        name="bloodComponent"
        options={["Plasma", "Red Blood Cell", "White Blood Cell", "Platelet"]}
        onChange={onChange}
        required
      />
    </FormRow>
    <FormRow columns={2}>
      <InputField
        label="Quantity Unit (e.g. 350ml)"
        name="quantityUnit"
        onChange={onChange}
        required
      />
      <InputField
        label="Contact Number"
        name="contact"
        onChange={onChange}
        required
      />
    </FormRow>
    <FormRow columns={3}>
      <InputField
        label="Height (cm)"
        name="height"
        type="number"
        onChange={onChange}
        required
      />
      <InputField
        label="Weight (kg)"
        name="weight"
        type="number"
        onChange={onChange}
        required
      />
      <InputField
        label="Preferred Date"
        name="preferredDate"
        type="date"
        onChange={onChange}
        required
      />
    </FormRow>
    <InputField label="Location" name="location" onChange={onChange} required />
    <TextAreaField
      label="Patient History"
      name="medicalContext"
      rows={3}
      onChange={onChange}
    />
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        name="healthScreening"
        required
        onChange={onChange}
        className="mt-1"
      />
      <label className="text-sm text-gray-700 dark:text-gray-200">
        I confirm that I am in good health and eligible to donate blood
      </label>
    </div>
  </>
);

export default DonateForm;
