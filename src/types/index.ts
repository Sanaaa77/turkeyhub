export type DegreeLevel = "Associate" | "Bachelor" | "Master" | "PhD" | "Medicine" | "Dentistry" | "Pharmacy";

export interface Program {
  id: string;
  name: string;
  faculty: string;
  degree: DegreeLevel;
  language: "Turkish" | "English" | "Mixed";
  duration: number;
  tuition: number;
  currency: "USD" | "TRY";
  requirements: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  coverage: number;
  type: "Merit" | "Need-based" | "Institutional" | "Government";
  description: string;
  requirements: string[];
  deadline: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  type: "Public" | "Private";
  city: string;
  rankingGlobal: number;
  rankingLocal: number;
  logo: string;
  heroImage: string;
  gallery: string[];
  description: string;
  tuitionRange: { min: number; max: number; currency: "USD" | "TRY" };
  scholarships: Scholarship[];
  dormitory: boolean;
  campusPhotos: string[];
  programs: Program[];
  faculties: string[];
  deadlines: { term: string; date: string }[];
  faq: { q: string; a: string }[];
  verified: boolean;
}

export interface City {
  id: string;
  name: string;
  rent: string;
  dorm: string;
  transport: string;
  food: string;
  safety: string;
  weather: string;
  internet: string;
  jobs: string;
  coords: { x: string; y: string };
  livingCost: "Low" | "Medium" | "High";
  population: string;
  studentLifeRating: number;
  transportation: string;
}
