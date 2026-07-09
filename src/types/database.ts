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

export type AcademyLanguage = "English" | "Turkish";
export type AcademyPath = "General English" | "Academic English" | "IELTS Preparation" | "A1" | "A2" | "B1" | "B2" | "C1" | "TÖMER Preparation";
export type AcademyStatus = "draft" | "published";
export type LessonComponent = "video" | "reading" | "vocabulary" | "grammar" | "listening" | "speaking" | "writing" | "quiz";

export interface AcademyCourse { id:string; title:string; language:AcademyLanguage; path:AcademyPath; level:string; description:string; status:AcademyStatus; readiness_weight:number; xp_reward:number; estimated_weeks:number; created_at:string; }
export interface AcademyModule { id:string; course_id:string; title:string; description:string; order_index:number; readiness_focus:string; xp_reward:number; created_at:string; }
export interface AcademyLesson { id:string; module_id:string; title:string; summary:string; order_index:number; duration_minutes:number; video_url:string|null; reading_content:string; vocabulary_count:number; grammar_focus:string; listening_prompt:string; speaking_prompt:string; writing_prompt:string; xp_reward:number; readiness_gain:number; status:AcademyStatus; created_at:string; }
export interface AcademyQuiz { id:string; lesson_id:string; title:string; pass_score:number; xp_reward:number; }
export interface AcademyQuestion { id:string; quiz_id:string; prompt:string; options:string[]; correct_answer:string; explanation:string; }
export interface AcademyVocabulary { id:string; lesson_id:string; term:string; translation:string; example:string; mastery_level:number; }
export interface AcademyAchievement { id:string; code:string; title:string; description:string; badge_icon:string; xp_reward:number; }
export interface StudentLessonCompletion { id:string; profile_id:string; lesson_id:string; score:number; xp_earned:number; readiness_gain:number; completed_at:string; }
export interface AcademyProgress { profile_id:string; daily_goal_minutes:number; weekly_goal_lessons:number; current_streak:number; longest_streak:number; total_xp:number; level:number; english_level:string; turkish_level:string; language_readiness:number; overall_readiness:number; last_lesson_id:string|null; updated_at:string; }
export interface AcademyMission { id:string; title:string; cadence:"daily"|"weekly"; target:number; progress:number; xp_reward:number; completed:boolean; }
export interface AcademyDashboard { progress:AcademyProgress; courses:AcademyCourse[]; modules:AcademyModule[]; lessons:AcademyLesson[]; recentCompletions:StudentLessonCompletion[]; achievements:AcademyAchievement[]; missions:AcademyMission[]; todayLesson:AcademyLesson; readinessGainToday:number; coachRecommendation:string; dreamUniversityProgress:number; weeklyCompleted:number; }
