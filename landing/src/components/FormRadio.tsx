import React from 'react';

interface FormRadioProps {
  label: string;
  name: string;
  value: boolean | null; // Allow null for initial state
  onChange: (value: boolean) => void;
  required?: boolean;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  label,
  name,
  value,
  onChange,
  required = true, // Note: HTML radio doesn't enforce required easily like text inputs
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === 'yes');
  };

  return (
    <fieldset className="space-y-1">
      <legend className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="mt-2 flex items-center space-x-6">
        <div className="flex items-center">
          <input
            id={`${name}-yes`}
            name={name}
            type="radio"
            value="yes"
            checked={value === true}
            onChange={handleChange}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor={`${name}-yes`} className="ml-2 block text-sm text-gray-900">
            Sí
          </label>
        </div>
        <div className="flex items-center">
          <input
            id={`${name}-no`}
            name={name}
            type="radio"
            value="no"
            checked={value === false}
            onChange={handleChange}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor={`${name}-no`} className="ml-2 block text-sm text-gray-900">
            No
          </label>
        </div>
      </div>
       {/* Add hidden input for validation if needed, though complex for radio */}
       {/* <input type="text" required={required} value={value === null ? "" : "selected"} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }} /> */}
    </fieldset>
  );
};
