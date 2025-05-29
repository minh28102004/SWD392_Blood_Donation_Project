import React from "react";
import {
  FormRow,
  InputField,
  SelectField,
  TextAreaField,
} from "@pages/Modal_Form_Registration/Form_Build/FormBuild";

const RequestForm = ({ onChange }) => (
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
        onChange={onChange}
        required
      />
    </FormRow>
    <FormRow columns={2}>
      <SelectField
        label="Required Blood Type"
        name="requiredBloodType"
        options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
        onChange={onChange}
        required
      />
      <SelectField
        label="Required Blood Component"
        name="bloodComponent"
        options={["Plasma", "Red Blood Cell", "White Blood Cell", "Platelet"]}
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
      <SelectField
        label="Urgency Level"
        name="urgencyLevel"
        options={["Normal", "Emergency"]}
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
    <InputField label="Location" name="location" onChange={onChange} required />
    <TextAreaField
      label="Patient History"
      name="medicalContext"
      rows={3}
      onChange={onChange}
    />
  </>
);

export default RequestForm;
