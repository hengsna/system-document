"use client";

import { Toolbar } from "./Toolbar";
import { QuestionList } from "./QuestionList";
import { PropertiesPanel } from "./PropertiesPanel";

export function SurveyBuilder() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Toolbar />
      <QuestionList />
      <PropertiesPanel />
    </div>
  );
}
