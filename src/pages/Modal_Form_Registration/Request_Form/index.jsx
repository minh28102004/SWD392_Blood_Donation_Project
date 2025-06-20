import React from "react";
import {
  FormRow,
  InputField,
  SelectField,
  TextAreaField,
} from "@pages/Modal_Form_Registration/Form_Build/FormBuild";

const RequestForm = ({ onChange, bloodTypes, bloodComponents }) => {
  const bloodTypeOptions = bloodTypes.map((bt) => ({
    value: bt.bloodTypeId.toString(),
    label: `${bt.name}${bt.rhFactor}`,
  }));

  const bloodComponentOptions = bloodComponents.map((bc) => ({
    value: bc.bloodComponentId.toString(),
    label: bc.name,
  }));

  return (
    <>
      <FormRow columns={2}>
        <InputField
          label="Full Name"
          name="name"
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
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          onChange={onChange}
          required
          colSpan={1}
        />
        <InputField
          label="Location"
          name="location"
          onChange={onChange}
          required
          colSpan={2}
        />
      </FormRow>
      <FormRow columns={3}>
        <SelectField
          label="Blood Type"
          name="bloodTypeId"
          options={bloodTypeOptions}
          onChange={onChange}
          required
        />
        <SelectField
          label="Blood Component"
          name="bloodComponentId"
          options={bloodComponentOptions}
          onChange={onChange}
          required
        />
        <InputField
          label="Quantity Unit (e.g. 350ml)"
          name="quantityUnit"
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
          options={[
            { label: "Normal", value: false },
            { label: "Emergency", value: true },
          ]}
          onChange={onChange}
          required
        />
      </FormRow>
      <TextAreaField
        label="Patient History"
        name="medicalContext"
        rows={3}
        onChange={onChange}
      />
    </>
  );
};

export default RequestForm;
