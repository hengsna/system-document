"use client";

import { useSurveyStore } from "@/store/useSurveyStore";
import { exportToXlsForm } from "@/utils/exportXlsForm";
import { QuestionType } from "@/types/xlsform";
import { Download, FileText, Hash, List, ListChecks, Type, MapPin, Image as ImageIcon, Mic, Video, Calculator } from "lucide-react";

export function Toolbar() {
  const { addQuestion, schema } = useSurveyStore();

  const handleAdd = (type: QuestionType) => {
    addQuestion({
      id: Math.random().toString(36).substring(2, 9),
      type,
      name: `question_${schema.survey.length + 1}`,
      label: { English: "New Question", Khmer: "សំណួរបន្ថែម" },
      required: false,
    });
  };

  const buttons = [
    { type: 'text', label: 'Text', icon: Type },
    { type: 'integer', label: 'Number', icon: Hash },
    { type: 'decimal', label: 'Decimal', icon: Hash },
    { type: 'select_one', label: 'Single Choice', icon: List },
    { type: 'select_multiple', label: 'Multiple Choice', icon: ListChecks },
    { type: 'note', label: 'Note', icon: FileText },
    { type: 'geopoint', label: 'GPS', icon: MapPin },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'audio', label: 'Audio', icon: Mic },
    { type: 'video', label: 'Video', icon: Video },
    { type: 'calculate', label: 'Calculate', icon: Calculator },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-gray-800">Add Question</h2>
      </div>
      <div className="p-4 flex-1 space-y-2">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => handleAdd(btn.type as QuestionType)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md border border-gray-100 transition-colors text-left"
          >
            <btn.icon size={16} />
            {btn.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t">
        <button
          onClick={() => exportToXlsForm(schema)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium text-sm"
        >
          <Download size={16} />
          Export XLSForm
        </button>
      </div>
    </div>
  );
}
