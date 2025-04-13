import React, { useState, useRef } from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react'; // Added icons

interface FileUploadProps {
  label: string;
  name: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  accept?: string; // e.g., "image/*,.pdf"
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  onChange,
  required = true,
  accept = ".pdf,.jpg,.jpeg,.png", // Default common types
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
    // Reset drag state if file selected via click
    setIsDragging(false);
  };

  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent triggering the file input click
    setSelectedFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input value
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Only set dragging to false if not dragging over a child element
    if (event.relatedTarget && !(event.currentTarget.contains(event.relatedTarget as Node))) {
        setIsDragging(false);
    } else if (!event.relatedTarget) {
        // Handle case where drag leaves the window entirely
        setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true); // Keep highlighting while dragging over
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    if (file && (!accept || accept.split(',').some(type => file.type.match(type.trim().replace('*', '.*'))))) {
        setSelectedFile(file);
        onChange(file);
        if (fileInputRef.current) {
            // Assign dropped files to input for consistency (though not strictly needed for state)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
        }
    } else {
        // Handle invalid file type drop if needed
        console.warn("Invalid file type dropped");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label
        htmlFor={name}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'} rounded-md cursor-pointer transition-colors`}
        onClick={triggerFileInput} // Trigger input when label area is clicked
      >
        <div className="space-y-1 text-center">
          {selectedFile ? (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <FileIcon className="w-8 h-8 text-gray-400 mr-2" />
              <span className="font-medium text-blue-600">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Subir un archivo</span>
                  <input
                    ref={fileInputRef}
                    id={name}
                    name={name}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required={required && !selectedFile} // Required only if no file is selected
                    accept={accept}
                  />
                </span>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500">
                Tipos aceptados: {accept.split(',').map(a => a.trim()).join(', ')}
              </p>
            </>
          )}
        </div>
      </label>
       {/* Hidden input for form validation if needed, especially if required */}
       {required && <input type="text" value={selectedFile ? "file_selected" : ""} required style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }} />}
    </div>
  );
};
