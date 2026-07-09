export type DegreeLevel = "Associate" | "Bachelor" | "Master" | "PhD" | "Medicine" | "Dentistry" | "Pharmacy";
export type ApplicationStatus = "Draft" | "Submitted" | "Reviewing" | "Accepted" | "Rejected" | "Visa_Processing" | "Completed";
export type DocumentStatus = "Pending" | "Verified" | "Rejected";
export type TaskStatus = "completed" | "pending" | "locked";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  nationality: string;
  current_city: string | null;
  gpa: number | null;
  budget: number | null;
  preferred_language: "English" | "Turkish" | "Mixed" | null;
  preferred_major: string | null;
  target_degree: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  living_cost_index: "Low" | "Medium" | "High";
  population: string | null;
  climate: string | null;
  description: string | null;
  image_url: string | null;
  coords: { x: string; y: string } | null;
  created_at: string;
  rent: string;
  dorm: string;
  transport: string;
  food: string;
}

export interface University {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  type: "Public" | "Private";
  ranking_global: number | null;
  ranking_local: number | null;
  logo_url: string | null;
  hero_image_url: string | null;
  description: string | null;
  dormitory_available: boolean;
  verified: boolean;
  website_url: string | null;
  created_at: string;
  city?: City; // Joined data
}

export interface Program {
  id: string;
  university_id: string;
  name: string;
  faculty: string | null;
  degree_level: string | null;
  language: "Turkish" | "English" | "Mixed" | null;
  duration_years: number | null;
  tuition_fee: number | null;
  currency: string;
  requirements: string[] | null;
  created_at: string;
}

export interface Scholarship {
  id: string;
  university_id: string;
  name: string;
  coverage_percentage: number | null;
  description: string | null;
  requirements: string[] | null;
  deadline: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  profile_id: string;
  university_id: string | null;
  program_id: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  university?: University;
  program?: Program;
}

export interface Document {
  id: string;
  profile_id: string;
  name: string;
  type: string;
  file_url: string;
  status: DocumentStatus;
  rejection_reason: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  profile_id: string;
  label: string;
  status: TaskStatus;
  category: string | null;
  due_date: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  message: string;
  read: boolean;
  type: string | null;
  created_at: string;
}
