export type QuestionType = 
  | 'text' | 'integer' | 'decimal' | 'select_one' | 'select_multiple' 
  | 'note' | 'geopoint' | 'image' | 'audio' | 'video' | 'calculate';

export interface SurveyRow {
  id: string; // Internal React ID
  type: QuestionType | string; // e.g., 'select_one gender_list'
  name: string; // Variable name (no spaces)
  label: Record<string, string>; // e.g., { 'English': 'Name', 'Khmer': 'ឈ្មោះ' }
  hint?: Record<string, string>;
  required?: boolean;
  relevant?: string; // Skip logic (e.g., '${age} > 18')
  calculation?: string;
  constraint?: string;
  constraint_message?: Record<string, string>;
}

export interface ChoiceRow {
  list_name: string;
  name: string;
  label: Record<string, string>;
}

export interface SurveySchema {
  survey: SurveyRow[];
  choices: ChoiceRow[];
  settings: { form_title: string; form_id: string; default_language: string };
}
