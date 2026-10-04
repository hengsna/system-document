"use client";

import { useSurveyStore } from "@/store/useSurveyStore";
import { Trash2, ArrowUp, ArrowDown, Type, Hash, List, ListChecks, FileText, MapPin, Image as ImageIcon, Mic, Video, Calculator, Settings, Rocket } from "lucide-react";

export function QuestionList() {
  const { schema, activeQuestionId, setActiveQuestionId, removeQuestion, reorderQuestions } = useSurveyStore();

  const handleDeploy = () => {
    alert("Deploying survey... (Not implemented yet)");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type size={18} className="text-gray-500" />;
      case 'integer':
      case 'decimal': return <Hash size={18} className="text-gray-500" />;
      case 'select_one': return <List size={18} className="text-gray-500" />;
      case 'select_multiple': return <ListChecks size={18} className="text-gray-500" />;
      case 'note': return <FileText size={18} className="text-gray-500" />;
      case 'geopoint': return <MapPin size={18} className="text-gray-500" />;
      case 'image': return <ImageIcon size={18} className="text-gray-500" />;
      case 'audio': return <Mic size={18} className="text-gray-500" />;
      case 'video': return <Video size={18} className="text-gray-500" />;
      case 'calculate': return <Calculator size={18} className="text-gray-500" />;
      default: return <Settings size={18} className="text-gray-500" />;
    }
  };

  if (schema.survey.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-gray-400 mb-2">
          <FileText size={48} className="opacity-50 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">Form is empty</h3>
        <p className="text-sm text-gray-500 mt-1">Add questions from the left toolbar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-t-lg shadow-sm border-b-4 border-blue-600 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{schema.settings.form_title}</h1>
            <p className="text-sm text-gray-500 mt-2">ID: {schema.settings.form_id} | Default Lang: {schema.settings.default_language}</p>
          </div>
          <button 
            onClick={handleDeploy}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-semibold"
          >
            <Rocket size={18} />
            Deploy Survey
          </button>
        </div>

        <div className="space-y-3">
          {schema.survey.map((q, index) => {
            const isActive = q.id === activeQuestionId;
            return (
              <div
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`bg-white p-4 rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                  isActive ? "border-blue-500 shadow-md scale-[1.01]" : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1">{getIcon(q.type)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-lg">
                        {index + 1}. {q.label?.English || "Unnamed Question"}
                      </span>
                      {q.required && <span className="text-red-500 font-bold">*</span>}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-mono">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">var: {q.name}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">type: {q.type}</span>
                      {q.relevant && <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">relevant: {q.relevant}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity" style={{ opacity: isActive ? 1 : undefined }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(index > 0) reorderQuestions(index, index - 1); }}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(index < schema.survey.length - 1) reorderQuestions(index, index + 1); }}
                      disabled={index === schema.survey.length - 1}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
