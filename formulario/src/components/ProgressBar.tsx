import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = totalSteps > 0 ? ((currentStep -1) / (totalSteps -1)) * 100 : 0;
  // Ensure percentage doesn't exceed 100 if currentStep somehow goes beyond totalSteps
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-700">
          Paso {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-700">{Math.round(displayPercentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
