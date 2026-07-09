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
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "stale";
export type PublicationStatus = "draft" | "published" | "archived";
export type ProgramApplicationStatus = "open" | "closed" | "opening_soon" | "rolling" | "unknown";

export interface SourceMetadata {
  id: string;
  source_type: "official_api" | "csv" | "json" | "excel" | "admin_upload" | "website" | "manual";
  name: string;
  url: string | null;
  api_endpoint: string | null;
  file_url: string | null;
  reliability_score: number;
  imported_at: string;
  last_checked_at: string | null;
}

export interface KnowledgeQualityFields {
  verification_status: VerificationStatus;
  data_completeness_score: number;
  source_id: string | null;
  last_updated_at: string;
  source?: SourceMetadata;
}

export interface Degree extends KnowledgeQualityFields {
  id: string;
  name: string;
  level: string;
  sort_order: number;
}

export interface Campus extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  city_id: string | null;
  name: string;
  slug: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  image_url: string | null;
  city?: City;
}

export interface Faculty extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  campus_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
}

export interface TuitionFee extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  program_id: string | null;
  academic_year: string;
  student_category: string;
  amount: number;
  currency: string;
  fee_type: "annual" | "semester" | "total" | "credit";
  notes: string | null;
}

export interface Requirement extends KnowledgeQualityFields {
  id: string;
  university_id: string | null;
  program_id: string | null;
  requirement_type?: string;
  name?: string;
  description: string;
  mandatory?: boolean;
  minimum_value?: string | null;
}

export interface LanguageRequirement extends KnowledgeQualityFields {
  id: string;
  university_id: string | null;
  program_id: string | null;
  language: string;
  test_name: string;
  minimum_score: string;
  waiver_rules: string | null;
}

export interface Intake extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  program_id: string | null;
  name: string;
  starts_on: string | null;
  academic_year: string | null;
  application_status: ProgramApplicationStatus;
}

export interface ApplicationDeadline extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  program_id: string | null;
  intake_id: string | null;
  deadline_type: string;
  deadline_at: string;
  status: ProgramApplicationStatus;
}

export interface Ranking extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  ranking_body: string;
  ranking_scope: string | null;
  rank_value: number | null;
  rank_band: string | null;
  subject: string | null;
  year: number;
}

export interface Dormitory extends KnowledgeQualityFields {
  id: string;
  university_id: string | null;
  campus_id: string | null;
  name: string;
  type: string | null;
  monthly_cost_min: number | null;
  monthly_cost_max: number | null;
  currency: string;
  capacity: number | null;
  description: string | null;
}

export interface LivingCost extends KnowledgeQualityFields {
  id: string;
  city_id: string | null;
  university_id: string | null;
  category: string;
  amount_min: number | null;
  amount_max: number | null;
  currency: string;
  period: "monthly" | "annual" | "one_time";
  notes: string | null;
}

export interface ExchangeProgram extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  name: string;
  partner_university: string | null;
  partner_country: string | null;
  description: string | null;
  website_url: string | null;
}

export interface CareerOutcome extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  program_id: string | null;
  outcome_type: string;
  description: string | null;
  employment_rate: number | null;
  average_salary: number | null;
  currency: string | null;
  top_employers: string[] | null;
}

export interface ContactInformation extends KnowledgeQualityFields {
  id: string;
  university_id: string | null;
  campus_id: string | null;
  office_id: string | null;
  contact_type: string;
  label: string | null;
  value: string;
  is_primary: boolean;
}

export interface UniversityFaq extends KnowledgeQualityFields {
  id: string;
  university_id: string | null;
  program_id: string | null;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

export interface UniversityMedia {
  id: string;
  university_id: string;
  campus_id: string | null;
  media_type: "logo" | "brochure" | "campus_image" | "gallery_image" | "video";
  title: string | null;
  url: string;
  alt_text: string | null;
  sort_order: number;
  verification_status: VerificationStatus;
  source_id: string | null;
  last_updated_at: string;
}

export interface InternationalOffice extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website_url: string | null;
  contact_person: string | null;
}

export interface NamedUniversityContent extends KnowledgeQualityFields {
  id: string;
  university_id: string;
  name: string;
  description: string | null;
  website_url: string | null;
}

export interface UniversityProfile extends University {
  overview: string | null;
  history: string | null;
  video_url: string | null;
  transportation: string | null;
  international_students: string | null;
  student_life: string | null;
  application_process: string | null;
  publication_status: PublicationStatus;
  verification_status: VerificationStatus;
  data_completeness_score: number;
  last_updated_at: string;
  campuses?: Campus[];
  faculties?: Faculty[];
  programs?: Program[];
  rankings?: Ranking[];
  admission_requirements?: Requirement[];
  required_documents?: Requirement[];
  language_requirements?: LanguageRequirement[];
  application_deadlines?: ApplicationDeadline[];
  intakes?: Intake[];
  dormitories?: Dormitory[];
  living_costs?: LivingCost[];
  exchange_programs?: ExchangeProgram[];
  career_outcomes?: CareerOutcome[];
  international_offices?: InternationalOffice[];
  contact_information?: ContactInformation[];
  university_faqs?: UniversityFaq[];
  university_media?: UniversityMedia[];
  student_clubs?: NamedUniversityContent[];
  research_centers?: NamedUniversityContent[];
}

export interface University {
  legal_name?: string | null;
  publication_status?: PublicationStatus;
  verification_status?: VerificationStatus;
  data_completeness_score?: number;
  last_updated_at?: string;
  programs?: Program[];
  scholarships?: Scholarship[];
  rankings?: Ranking[];
}

export interface Program {
  slug?: string | null;
  degree_id?: string | null;
  faculty_id?: string | null;
  credits?: number | null;
  curriculum?: unknown;
  required_gpa?: number | null;
  required_ielts?: number | null;
  required_toefl?: number | null;
  required_tomer?: string | null;
  portfolio_required?: boolean;
  interview_required?: boolean;
  scholarship_available?: boolean;
  career_opportunities?: string[] | null;
  application_status?: ProgramApplicationStatus;
  verification_status?: VerificationStatus;
  data_completeness_score?: number;
  last_updated_at?: string;
  degree?: Degree;
  tuition_fees?: TuitionFee[];
  language_requirements?: LanguageRequirement[];
  required_documents?: Requirement[];
  career_outcomes?: CareerOutcome[];
}
