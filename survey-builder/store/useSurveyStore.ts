import { create } from 'zustand';
import { SurveyRow, ChoiceRow, SurveySchema } from '../types/xlsform';

interface SurveyStore {
  schema: SurveySchema;
  activeQuestionId: string | null;
  addQuestion: (question: SurveyRow) => void;
  updateQuestion: (id: string, updates: Partial<SurveyRow>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  setActiveQuestionId: (id: string | null) => void;
  updateSettings: (updates: Partial<SurveySchema['settings']>) => void;
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  schema: {
    survey: [],
    choices: [],
    settings: { form_title: 'New Survey', form_id: 'survey_01', default_language: 'English' },
  },
  activeQuestionId: null,
  addQuestion: (question) =>
    set((state) => ({
      schema: { ...state.schema, survey: [...state.schema.survey, question] },
      activeQuestionId: question.id,
    })),
  updateQuestion: (id, updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        survey: state.schema.survey.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      },
    })),
  removeQuestion: (id) =>
    set((state) => ({
      schema: {
        ...state.schema,
        survey: state.schema.survey.filter((q) => q.id !== id),
      },
      activeQuestionId: state.activeQuestionId === id ? null : state.activeQuestionId,
    })),
  reorderQuestions: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.schema.survey);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { schema: { ...state.schema, survey: result } };
    }),
  setActiveQuestionId: (id) => set({ activeQuestionId: id }),
  updateSettings: (updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        settings: { ...state.schema.settings, ...updates },
      },
    })),
}));
