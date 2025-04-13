import { AlertCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DuplicatePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DuplicatePassportModal: React.FC<DuplicatePassportModalProps> = ({
  isOpen,
  onClose,
}) => {
    const navigate = useNavigate();
  if (!isOpen) return null;

  const handleRedirect = () => {
    onClose(); // Opcional: cerrar el modal antes de redirigir
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
          Ya tiene un proceso existente
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Ya existe un proceso asociado a este usuario, por lo que no puede
          volver a completar el formulario. Cada usuario tiene asignado un único
          formulario.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir a la página principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicatePassportModal;
