import {
  FormRow,
  InputField,
  SelectField,
  TextAreaField,
} from "@pages/Modal_Form_Registration/Form_Build/FormBuild";

const RequestForm = ({ register, bloodTypes, bloodComponents, errors }) => {
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
          required
          register={register}
        />
        <InputField
          label="Contact Number"
          name="contact"
          required
          register={register}
          validation={{
            required: "Phone is required",
            pattern: {
              value: /^[0-9]{8,15}$/,
              message: "Phone must be a number with 8–15 digits",
            },
          }}
          error={errors.contact}
        />
      </FormRow>

      <FormRow columns={3}>
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          required
          register={register}
        />
        <InputField
          label="Location"
          name="location"
          required
          colSpan={2}
          register={register}
        />
      </FormRow>

      <FormRow columns={3}>
        <SelectField
          label="Blood Type"
          name="bloodTypeId"
          required
          options={bloodTypeOptions}
          register={register}
          validation={{ required: "Select blood type" }}
        />
        <SelectField
          label="Blood Component"
          name="bloodComponentId"
          required
          options={bloodComponentOptions}
          register={register}
          validation={{ required: "Select component" }}
        />
        <InputField
          label="Quantity (ml)"
          name="quantityUnit"
          required
          register={register}
          validation={{
            required: "Quantity is required",
            pattern: {
              value: /^[1-9][0-9]*$/,
              message: "Must be a positive number",
            },
          }}
          error={errors.quantityUnit}
        />
      </FormRow>

      <FormRow columns={3}>
        <InputField
          label="Height (cm)"
          name="height"
          type="number"
          required
          register={register}
          validation={{
            required: "Height is required",
            min: { value: 50, message: "Minimum 50cm" },
          }}
          error={errors.height}
        />
        <InputField
          label="Weight (kg)"
          name="weight"
          type="number"
          required
          register={register}
          validation={{
            required: "Weight is required",
            min: { value: 30, message: "Minimum 30kg" },
          }}
          error={errors.weight}
        />
        <SelectField
          label="Urgency Level"
          name="urgencyLevel"
          required
          options={[
            { label: "Normal", value: "false" },
            { label: "Emergency", value: "true" },
          ]}
          register={register}
          validation={{ required: "Please select urgency level" }}
          error={errors.urgencyLevel}
        />
      </FormRow>

      <TextAreaField
        label="Patient History"
        name="medicalContext"
        register={register}
        rows={3}
      />
    </>
  );
};

export default RequestForm;
