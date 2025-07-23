import React, {
  useState,
  useReducer,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeartbeat,
  FaNotesMedical,
  FaStethoscope,
  FaVenusMars,
  FaCheckCircle,
} from "react-icons/fa";

const initialState = {
  feelingHealthy: "",
  currentSymptoms: [],
  chronicConditions: [],
  medications: "",
  recentTreatments: [],
  riskFactors: [],
  gender: "",
  pregnancyStatus: "",
  menstruation: "",
  recentChildbirth: "",
  maleRecentDonation: "",
  maleHormoneTherapy: "",
  agreement: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

const MedicalDeclarationModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState({});

  const baseClass = `border border-gray-300 bg-white 
  text-black rounded-md hover:border-blue-500 focus:border-blue-500 
  focus:outline-none focus:ring-1 transition-all duration-200`;

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      if (step === 1) {
        if (!formState.feelingHealthy) {
          newErrors.feelingHealthy =
            "Please indicate if you are feeling healthy today";
        }
      }

      if (step === 2) {
        if (
          !formState.chronicConditions.length &&
          !formState.chronicConditions.includes("None")
        ) {
          newErrors.chronicConditions =
            "Please select at least one chronic condition";
        }
      }

      if (step === 3) {
        if (
          !formState.recentTreatments.length &&
          !formState.recentTreatments.includes("None")
        ) {
          newErrors.recentTreatments =
            "Please select at least one recent treatment";
        }
        if (
          !formState.riskFactors.length &&
          !formState.riskFactors.includes("None")
        ) {
          newErrors.riskFactors = "Please select at least one risk factor";
        }
      }

      if (step === 4) {
        if (!formState.gender) {
          newErrors.gender = "Please select your gender";
        }
        if (formState.gender === "female") {
          if (!formState.pregnancyStatus) {
            newErrors.pregnancyStatus = "Please select pregnancy status";
          }
          if (!formState.menstruation) {
            newErrors.menstruation = "Please select menstruation status";
          }
          if (!formState.recentChildbirth) {
            newErrors.recentChildbirth = "Please select childbirth status";
          }
        } else if (formState.gender === "male") {
          if (!formState.maleRecentDonation) {
            newErrors.maleRecentDonation =
              "Please answer recent blood donation";
          }
          if (!formState.maleHormoneTherapy) {
            newErrors.maleHormoneTherapy = "Please answer hormone therapy";
          }
        }
      }

      if (step === 5 && !formState.agreement) {
        newErrors.agreement = "Please agree to the terms";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formState]
  );

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (validateStep(5)) {
      const cleanList = (list) =>
        list
          .filter(
            (item) => item && item.trim() !== "Other:" && item.trim() !== ""
          )
          .join(", ") || "None";

      const result = `
- Feeling healthy: ${formState.feelingHealthy}
- Symptoms: ${cleanList(formState.currentSymptoms)}
- Chronic diseases: ${cleanList(formState.chronicConditions)}
- Currently on medication: ${formState.medications.trim() || "None"}
- Recent treatments: ${cleanList(formState.recentTreatments)}
- Risk factors: ${cleanList(formState.riskFactors)}
- Gender: ${formState.gender}
${
  formState.gender === "female"
    ? `
- Pregnancy: ${formState.pregnancyStatus}
- Menstruation: ${formState.menstruation}
- Recent childbirth: ${formState.recentChildbirth}`
    : `
- Recent Donation: ${formState.maleRecentDonation}
- Hormone Therapy: ${formState.maleHormoneTherapy}`
}
`.trim();

      onSubmit(result);
    }
  };

  const progress = useMemo(() => (currentStep / 5) * 100, [currentStep]);

  const renderCheckboxGroup = (options, field, values) => {
    const hasOther = values.find((v) => v.startsWith("Other: "));
    const hasNone = values.includes("None");

    const handleChange = (item, checked) => {
      let updated = [...values];

      if (item === "None") {
        updated = checked ? ["None"] : updated.filter((i) => i !== "None");
      } else {
        updated = checked
          ? [...updated.filter((i) => i !== "None"), item]
          : updated.filter((i) => i !== item);
      }

      dispatch({ type: "UPDATE_FIELD", field, value: updated });
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-blue-50"
          >
            <input
              type="checkbox"
              value={item}
              checked={values.includes(item)}
              onChange={(e) => handleChange(item, e.target.checked)}
              disabled={hasNone}
            />
            {item}
          </label>
        ))}

        {/* None */}
        <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-blue-50">
          <input
            type="checkbox"
            checked={hasNone}
            onChange={(e) => handleChange("None", e.target.checked)}
          />
          None
        </label>

        {/* Other */}
        <label className="flex items-center gap-2 p-2 border rounded-lg">
          <input
            type="checkbox"
            checked={!!hasOther}
            onChange={(e) => {
              if (!e.target.checked) {
                dispatch({
                  type: "UPDATE_FIELD",
                  field,
                  value: values.filter((v) => !v.startsWith("Other:")),
                });
              } else {
                dispatch({
                  type: "UPDATE_FIELD",
                  field,
                  value: [
                    ...values.filter((v) => !v.startsWith("Other:")),
                    "Other: ",
                  ],
                });
              }
            }}
            disabled={hasNone}
          />
          Other:
          {hasOther && (
            <input
              type="text"
              value={hasOther.replace("Other: ", "")}
              onChange={(e) => {
                const newVal = `Other: ${e.target.value}`;
                const filtered = values.filter((v) => !v.startsWith("Other:"));
                dispatch({
                  type: "UPDATE_FIELD",
                  field,
                  value: [...filtered, newVal],
                });
              }}
              onBlur={(e) => {
                const val = e.target.value.trim();
                const filtered = values.filter((v) => !v.startsWith("Other:"));
                if (val === "") {
                  const hasOtherRemoved = filtered;
                  const finalValues =
                    hasOtherRemoved.length > 0 ? hasOtherRemoved : ["None"];
                  dispatch({
                    type: "UPDATE_FIELD",
                    field,
                    value: finalValues,
                  });
                }
              }}
              className={`${baseClass} flex-1 rounded px-2 py-1`}
            />
          )}
        </label>
      </div>
    );
  };

  const renderRadioGroup = (name, options, selectedValue) => (
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-blue-50"
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={selectedValue === opt}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: name,
                value: e.target.value,
              })
            }
          />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg text-left">
                <Dialog.Title className="text-2xl font-bold mb-4 text-center">
                  Medical Health Declaration
                </Dialog.Title>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-rose-600">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-rose-700">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full shadow-inner overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <FaHeartbeat className="text-red-500" /> Step 1:
                          Current Health Status
                        </h4>

                        {/* NEW: Inline layout for question and radio group */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                          <p className="font-medium whitespace-nowrap mb-1 sm:mb-0">
                            Are you feeling healthy today?
                          </p>
                          <div className="flex gap-4">
                            {["Yes", "No"].map((option) => (
                              <label
                                key={option}
                                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-blue-50"
                              >
                                <input
                                  type="radio"
                                  name="feelingHealthy"
                                  value={option}
                                  checked={formState.feelingHealthy === option}
                                  onChange={(e) =>
                                    dispatch({
                                      type: "UPDATE_FIELD",
                                      field: "feelingHealthy",
                                      value: e.target.value,
                                    })
                                  }
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>

                        {errors.feelingHealthy && (
                          <p className="text-sm text-red-500">
                            {errors.feelingHealthy}
                          </p>
                        )}

                        <p className="font-medium">Symptoms:</p>
                        {renderCheckboxGroup(
                          [
                            "Fever",
                            "Cough",
                            "Sore Throat",
                            "Diarrhea",
                            "Fatigue",
                          ],
                          "currentSymptoms",
                          formState.currentSymptoms
                        )}
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <FaNotesMedical className="text-red-600" /> Step 2:
                          Medical Conditions
                        </h4>

                        <p className="font-medium">Chronic Conditions:</p>
                        {renderCheckboxGroup(
                          [
                            "Hypertension",
                            "Diabetes",
                            "Asthma",
                            "Heart Disease",
                          ],
                          "chronicConditions",
                          formState.chronicConditions
                        )}
                        {errors.chronicConditions && (
                          <p className="text-sm text-rose-600">
                            {errors.chronicConditions}
                          </p>
                        )}
                        <label className="block font-medium mt-4">
                          Are you taking any medications? (Let skip if not
                          applicable)
                        </label>
                        <input
                          type="text"
                          value={formState.medications}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_FIELD",
                              field: "medications",
                              value: e.target.value,
                            })
                          }
                          className={`${baseClass} w-full px-3 py-2`}
                          placeholder="List any medications you are currently taking"
                        />
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <FaStethoscope className="text-emerald-500" /> Step 3:
                          Risk Assessment
                        </h4>

                        <p className="font-medium">Recent Treatments:</p>
                        {renderCheckboxGroup(
                          [
                            "Surgery",
                            "Blood Transfusion",
                            "Dental Work",
                            "Hospitalization",
                          ],
                          "recentTreatments",
                          formState.recentTreatments
                        )}
                        {errors.recentTreatments && (
                          <p className="text-sm text-red-500">
                            {errors.recentTreatments}
                          </p>
                        )}
                        <p className="font-medium">Risk Factors:</p>
                        {renderCheckboxGroup(
                          [
                            "Tattoo",
                            "Piercing",
                            "Unsafe Sex",
                            "Exposure to Infection",
                          ],
                          "riskFactors",
                          formState.riskFactors
                        )}
                        {errors.riskFactors && (
                          <p className="text-sm text-red-500">
                            {errors.riskFactors}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <FaVenusMars className="text-blue-500" /> Step 4:
                          Gender Specific
                        </h4>

                        <p className="font-medium">Gender:</p>
                        {renderRadioGroup(
                          "gender",
                          ["male", "female"],
                          formState.gender
                        )}
                        {errors.gender && (
                          <p className="text-sm text-red-500">
                            {errors.gender}
                          </p>
                        )}

                        {formState.gender === "female" && (
                          <>
                            <p className="font-medium mt-2">
                              Pregnancy Status:
                            </p>
                            {renderRadioGroup(
                              "pregnancyStatus",
                              ["Yes", "No"],
                              formState.pregnancyStatus
                            )}
                            {errors.pregnancyStatus && (
                              <p className="text-sm text-red-500">
                                {errors.pregnancyStatus}
                              </p>
                            )}
                            <p className="font-medium mt-2">Menstruation:</p>
                            {renderRadioGroup(
                              "menstruation",
                              ["Yes", "No"],
                              formState.menstruation
                            )}
                            {errors.menstruation && (
                              <p className="text-sm text-red-500">
                                {errors.menstruation}
                              </p>
                            )}
                            <p className="font-medium mt-2">
                              Recent Childbirth:
                            </p>
                            {renderRadioGroup(
                              "recentChildbirth",
                              ["Yes", "No"],
                              formState.recentChildbirth
                            )}
                            {errors.recentChildbirth && (
                              <p className="text-sm text-red-500">
                                {errors.recentChildbirth}
                              </p>
                            )}
                          </>
                        )}

                        {formState.gender === "male" && (
                          <>
                            <p className="font-medium mt-2">
                              Have you donated blood in the past 3 months?
                            </p>
                            {renderRadioGroup(
                              "maleRecentDonation",
                              ["Yes", "No"],
                              formState.maleRecentDonation
                            )}
                            {errors.maleRecentDonation && (
                              <p className="text-sm text-red-500">
                                {errors.maleRecentDonation}
                              </p>
                            )}
                            <p className="font-medium mt-2">
                              Are you currently on any hormone therapy?
                            </p>
                            {renderRadioGroup(
                              "maleHormoneTherapy",
                              ["Yes", "No"],
                              formState.maleHormoneTherapy
                            )}
                            {errors.maleHormoneTherapy && (
                              <p className="text-sm text-red-500">
                                {errors.maleHormoneTherapy}
                              </p>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" /> Step 5:
                          Confirmation
                        </h4>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formState.agreement}
                            onChange={(e) =>
                              dispatch({
                                type: "UPDATE_FIELD",
                                field: "agreement",
                                value: e.target.checked,
                              })
                            }
                          />
                          I confirm all information provided is accurate.
                        </label>
                        {errors.agreement && (
                          <p className="text-sm text-red-500">
                            {errors.agreement}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between pt-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-3.5 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-t from-rose-400 via-rose-500 to-red-400 rounded-lg hover:brightness-90 transition-all duration-200 shadow-sm"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MedicalDeclarationModal;
