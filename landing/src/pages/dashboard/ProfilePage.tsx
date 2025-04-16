import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Building2, MapPin, PencilLine, Save, X, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    phone: '+48 123 456 789',
    whatsapp: '+48 123 456 789',
    email: 'usuario@email.com',
    employer: 'Prosper',
    address: 'Mazurska 24 Lukta',
    voivodeship: 'Varmisko mazurskie',
    emergencyContact: {
      name: 'Juan Pérez',
      phone: '+48 666 777 888',
      relationship: 'Coordinador'
    },
    additionalInfo: {
      nationality: 'Colombiano',
      passportNumber: 'XDG123456',
      pesel: '12345678901'
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Aviso de actualización */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-blue-700">
              Por favor, actualiza tus datos si hay algún cambio en tu información personal, de contacto o laboral. 
              Mantener la información actualizada nos permite llevar un proceso más prolijo y ordenado.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <PencilLine className="h-4 w-4 mr-1" />
              Editar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Teléfono</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.phone}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">WhatsApp</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.whatsapp}
                    onChange={(e) => setEditedProfile({...editedProfile, whatsapp: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.whatsapp}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Trabajo Actual</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.employer}
                    onChange={(e) => setEditedProfile({...editedProfile, employer: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.employer}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Dirección</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.address}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Voivodato</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.voivodeship}
                    onChange={(e) => setEditedProfile({...editedProfile, voivodeship: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium">{profile.voivodeship}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacto Coordinador/Agencia</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.emergencyContact.name}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  emergencyContact: {...editedProfile.emergencyContact, name: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.emergencyContact.name}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.emergencyContact.phone}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  emergencyContact: {...editedProfile.emergencyContact, phone: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.emergencyContact.phone}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Relación</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.emergencyContact.relationship}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  emergencyContact: {...editedProfile.emergencyContact, relationship: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.emergencyContact.relationship}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Adicional</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nacionalidad</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.additionalInfo.nationality}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  additionalInfo: {...editedProfile.additionalInfo, nationality: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.additionalInfo.nationality}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Número de Pasaporte</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.additionalInfo.passportNumber}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  additionalInfo: {...editedProfile.additionalInfo, passportNumber: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.additionalInfo.passportNumber}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">PESEL</p>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.additionalInfo.pesel}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  additionalInfo: {...editedProfile.additionalInfo, pesel: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="font-medium">{profile.additionalInfo.pesel}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
