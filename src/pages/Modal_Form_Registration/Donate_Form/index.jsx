import {
  FormRow,
  InputField,
  SelectField,
  TextAreaField,
} from "@pages/Modal_Form_Registration/Form_Build/FormBuild";
import LocationSelector from "@pages/Modal_Form_Registration/Form_Build/LocationSelector";
import MedicalDeclarationModal from "@pages/Modal_Form_Registration/Form_Build/MedicalDeclarationForm";

const DonateForm = ({
  register,
  bloodTypes,
  bloodComponents,
  errors,
  setValue,
  watch,
  showMedicalModal,
  setShowMedicalModal,
}) => {
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
          placeholder="Enter full name"
        />
        <InputField
          label="Contact Number"
          name="contact"
          required
          register={register}
          placeholder="E.g: 0912345678"
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
          placeholder="Select date of birth"
        />
        <InputField
          label="Last Donate Date (If have)"
          name="lastDonationDate"
          type="date"
          required
          register={register}
          placeholder="Select last donation date"
        />
        <InputField
          label="Prefer Date"
          name="preferredDate"
          type="date"
          required
          register={register}
          placeholder="Select preferred date"
        />
      </FormRow>

      <FormRow columns={3}>
        <SelectField
          label="Blood Type"
          name="bloodTypeId"
          required
          options={bloodTypeOptions}
          register={register}
          placeholder="Select blood type"
          validation={{ required: "Select blood type" }}
        />
        <SelectField
          label="Blood Component"
          name="bloodComponentId"
          required
          options={bloodComponentOptions}
          register={register}
          placeholder="Select component"
          validation={{ required: "Select component" }}
        />
        <InputField
          label="Blood Quantity (ml)"
          name="quantityUnit"
          type="number"
          step={10}
          min={50}
          max={500}
          required
          register={register}
          placeholder="e.g. 250, 300, 350"
          validation={{
            required: "Quantity is required",
            min: { value: 50, message: "Minimum allowed is 50 ml" },
            max: { value: 500, message: "Maximum allowed is 500 ml" },
            validate: (val) =>
              val % 10 === 0 ||
              "Must be a multiple of 10 (e.g., 250, 300, 350...)",
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
          step="any"
          register={register}
          placeholder="E.g: 170, 165"
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
          step="any"
          register={register}
          placeholder="E.g: 60, 75"
          validation={{
            required: "Weight is required",
            min: { value: 30, message: "Minimum 30kg" },
          }}
          error={errors.weight}
        />
      </FormRow>
      <LocationSelector
        register={register}
        setValue={setValue}
        getValues={watch}
        errors={errors}
        required
      />

      <TextAreaField
        label="Medical History"
        name="medicalContext"
        register={register}
        rows={3}
        required
        placeholder="Click to declare your medical status"
        onClick={() => setShowMedicalModal(true)}
      />
      <MedicalDeclarationModal
        isOpen={showMedicalModal}
        onClose={() => setShowMedicalModal(false)}
        onSubmit={(result) => {
          setValue("medicalContext", result);
          setShowMedicalModal(false);
        }}
      />
    </>
  );
};

export default DonateForm;
