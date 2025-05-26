import { FaTint, FaHeartbeat, FaUserMd } from "react-icons/fa";
import { GiMedicalDrip } from "react-icons/gi";

const images = import.meta.glob("@assets/Blood_image/*.jpg", {
  eager: true,
  import: "default",
});

const imageList = Object.values(images);

const bloodTypes = [
  {
    type: "A+",
    population: "35.7%",
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    donatesTo: ["A+", "AB+"],
    rarityNote: "Common",
    description:
      "Second most common blood type, often needed for trauma patients.",
    color: "bg-rose-300",
    border: "border-rose-300",
    bg: "bg-rose-50",
  },
  {
    type: "O+",
    population: "37.4%",
    canReceiveFrom: ["O+", "O-"],
    donatesTo: ["O+", "A+", "B+", "AB+"],
    rarityNote: "Most Common",
    description:
      "Most in-demand type for transfusions. Especially needed in emergencies.",
    color: "bg-sky-300",
    border: "border-sky-300",
    bg: "bg-sky-50",
  },
  {
    type: "B+",
    population: "8.5%",
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    donatesTo: ["B+", "AB+"],
    rarityNote: "Less Common",
    description: "Essential for patients with blood disorders and cancer.",
    color: "bg-emerald-300",
    border: "border-emerald-300",
    bg: "bg-emerald-50",
  },
  {
    type: "AB+",
    population: "3.4%",
    canReceiveFrom: ["All Types"],
    donatesTo: ["AB+"],
    rarityNote: "Universal Recipient",
    description:
      "Can receive from anyone, but can only donate to other AB+ individuals.",
    color: "bg-violet-300",
    border: "border-violet-300",
    bg: "bg-violet-50",
  },
  {
    type: "A-",
    population: "6.3%",
    canReceiveFrom: ["A-", "O-"],
    donatesTo: ["A+", "A-", "AB+", "AB-"],
    rarityNote: "Rare",
    description:
      "Often needed in surgeries and for immunocompromised patients.",
    color: "bg-rose-300",
    border: "border-rose-300",
    bg: "bg-rose-50",
  },
  {
    type: "O-",
    population: "6.6%",
    canReceiveFrom: ["O-"],
    donatesTo: ["All Types"],
    rarityNote: "Universal Donor",
    description:
      "Universal donor for red cells. Crucial in emergencies and for newborns.",
    color: "bg-sky-300",
    border: "border-sky-300",
    bg: "bg-sky-50",
  },
  {
    type: "B-",
    population: "1.5%",
    canReceiveFrom: ["B-", "O-"],
    donatesTo: ["B+", "B-", "AB+", "AB-"],
    rarityNote: "Very Rare",
    description:
      "Essential for rare disease treatment and emergency transfusions.",
    color: "bg-emerald-300",
    border: "border-emerald-300",
    bg: "bg-emerald-50",
  },
  {
    type: "AB-",
    population: "0.6%",
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    donatesTo: ["AB+", "AB-"],
    rarityNote: "Rarest Type",
    description: "Most rare type. Extremely valuable for AB- recipients.",
    color: "bg-violet-300",
    border: "border-violet-300",
    bg: "bg-violet-50",
  },
];

const bloodComponents = [
  {
    name: "Red Blood Cells",
    description:
      "Transport oxygen from the lungs and remove carbon dioxide. Essential for survival, especially in cases of blood loss or anemia.",
    usage: "Used in surgeries, trauma, and treating chronic anemia cases.",
    storage: "Stored refrigerated at 1–6°C with a shelf life of up to 42 days.",
    image: imageList[2],
    icon: <FaTint className="text-red-500" />,
  },
  {
    name: "White Blood Cells",
    description:
      "Fight infection and protect the body against bacteria, viruses, and foreign invaders.",
    usage: "Used in immune-compromised patients with severe infections.",
    storage: "Used fresh when needed; not stored routinely for transfusion.",
    image: imageList[3],
    icon: <FaUserMd className="text-blue-500" />,
  },
  {
    name: "Platelets",
    description:
      "Help blood clot and prevent excessive bleeding. Critical in cancer therapy and surgeries.",
    usage: "Given to cancer, transplant, or post-operative bleeding patients.",
    storage: "Stored at 20–24°C with constant agitation, lasts 5 to 7 days.",
    image: imageList[1],
    icon: <FaHeartbeat className="text-green-500" />,
  },
  {
    name: "Plasma",
    description:
      "Straw-colored fluid carrying nutrients, hormones, and proteins. Used to treat trauma and clotting disorders.",
    usage: "Used in treating burns, shock, or clotting factor conditions.",
    storage:
      "Frozen within 24 hours and kept up to one year at -18°C or lower.",
    image: imageList[0],
    icon: <GiMedicalDrip className="text-yellow-500" />,
  },
];

export { bloodTypes, bloodComponents };
