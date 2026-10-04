"use client";

import { useSurveyStore } from "@/store/useSurveyStore";
import { X } from "lucide-react";

export function PropertiesPanel() {
  const { schema, activeQuestionId, updateQuestion, setActiveQuestionId } = useSurveyStore();

  const activeQuestion = schema.survey.find((q) => q.id === activeQuestionId);

  if (!activeQuestion) {
    return (
      <div className="w-80 bg-white border-l h-screen p-6 flex items-center justify-center text-gray-400">
        <p className="text-sm text-center">Select a question to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (field: string, value: string | boolean) => {
    updateQuestion(activeQuestion.id, { [field]: value });
  };

  const handleLabelChange = (lang: string, value: string) => {
    updateQuestion(activeQuestion.id, {
      label: { ...activeQuestion.label, [lang]: value },
    });
  };

  return (
    <div className="w-80 bg-white border-l h-screen overflow-y-auto flex flex-col shadow-lg">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
        <h2 className="font-bold text-lg text-gray-800">Properties</h2>
        <button onClick={() => setActiveQuestionId(null)} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
          <div className="px-3 py-2 bg-gray-100 rounded text-sm text-gray-700 font-mono">
            {activeQuestion.type}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Variable Name (Data Column)</label>
          <input
            type="text"
            value={activeQuestion.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. first_name"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Label (English)</label>
          <input
            type="text"
            value={activeQuestion.label?.English || ""}
            onChange={(e) => handleLabelChange("English", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Label (Khmer)</label>
          <input
            type="text"
            value={activeQuestion.label?.Khmer || ""}
            onChange={(e) => handleLabelChange("Khmer", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="required-checkbox"
            checked={!!activeQuestion.required}
            onChange={(e) => handleChange("required", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="required-checkbox" className="text-sm font-medium text-gray-700">
            Required Question
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Skip Logic (Relevant)</label>
          <input
            type="text"
            value={activeQuestion.relevant || ""}
            onChange={(e) => handleChange("relevant", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. ${age} > 18"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Constraint</label>
          <input
            type="text"
            value={activeQuestion.constraint || ""}
            onChange={(e) => handleChange("constraint", e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. . > 0 and . < 100"
          />
        </div>
      </div>
    </div>
  );
}
