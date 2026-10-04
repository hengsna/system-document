import * as XLSX from 'xlsx';
import { SurveySchema } from '../types/xlsform';

export const exportToXlsForm = (schema: SurveySchema) => {
  const wb = XLSX.utils.book_new();

  // 1. Flatten Translations for Survey Sheet
  const surveyData = schema.survey.map((row) => {
    const flatRow: any = { type: row.type, name: row.name, required: row.required ? 'yes' : 'no' };
    
    // Add translations dynamically (e.g., label::English)
    Object.entries(row.label).forEach(([lang, val]) => (flatRow[`label::${lang}`] = val));
    if (row.hint) {
      Object.entries(row.hint).forEach(([lang, val]) => (flatRow[`hint::${lang}`] = val));
    }
    
    if (row.relevant) flatRow.relevant = row.relevant;
    if (row.calculation) flatRow.calculation = row.calculation;
    
    return flatRow;
  });

  const wsSurvey = XLSX.utils.json_to_sheet(surveyData);
  XLSX.utils.book_append_sheet(wb, wsSurvey, 'survey');

  // 2. Choices Sheet (for multiple choice)
  const choicesData = schema.choices.map((row) => {
    const flatRow: any = { list_name: row.list_name, name: row.name };
    Object.entries(row.label).forEach(([lang, val]) => (flatRow[`label::${lang}`] = val));
    return flatRow;
  });
  
  const wsChoices = XLSX.utils.json_to_sheet(choicesData);
  XLSX.utils.book_append_sheet(wb, wsChoices, 'choices');

  // 3. Settings Sheet
  const wsSettings = XLSX.utils.json_to_sheet([schema.settings]);
  XLSX.utils.book_append_sheet(wb, wsSettings, 'settings');

  // Trigger download
  XLSX.writeFile(wb, `${schema.settings.form_id}.xlsx`);
};
