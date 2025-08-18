interface Specialty {
  name: string;
  subSpecialties: string[];
}


export const specialties: Specialty[] = [
  {
    name: "Cardiology",
    subSpecialties: [
      "Interventional Cardiology",
      "Electrophysiology",
      "Heart Failure",
      "Preventive Cardiology",
    ],
  },
  {
    name: "Neurology",
    subSpecialties: [
      "Epileptology",
      "Stroke Medicine",
      "Movement Disorders",
      "Pediatric Neurology",
    ],
  },
  {
    name: "Orthopedics",
    subSpecialties: [
      "Spine Surgery",
      "Sports Medicine",
      "Joint Replacement",
      "Pediatric Orthopedics",
    ],
  },
  {
    name: "Pediatrics",
    subSpecialties: [
      "Neonatology",
      "Pediatric Cardiology",
      "Pediatric Endocrinology",
      "Developmental Pediatrics",
    ],
  },
];




export const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Mandarin",
  "Arabic",
  "Portuguese",
];