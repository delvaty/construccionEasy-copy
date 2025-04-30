import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  Building2,
  MapPin,
  PencilLine,
  Save,
  X,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Users,
  School,
  Flag,
  Plane,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase/client";
import { ProfileData } from "../../types/types";

interface ValidationErrors {
  [key: string]: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState<ValidationErrors>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const initialProfile: ProfileData = {
    // Client info
    fullName: "",
    passportNumber: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    currentJob: "",
    currentAgency: "",

    // Contact info
    phone: "",
    whatsapp: "",
    address: "",
    voivodeship: "",

    // New residence application info
    placeOfBirth: "",
    peselNumber: "",
    height: "",
    eyeColor: "",
    hairColor: "",
    fatherName: "",
    motherName: "",
    maritalStatus: "",
    educationLevel: "",
    city: "",
    zipCode: "",
    euEntryDate: "",
    polandArrivalDate: "",
    transportMethod: "",
    traveledLast5Years: false,
    hasRelativesInPoland: false,

    // Ongoing process info
    firstName: "",
    lastName: "",
    hasWorkPermit: false,
    processStage: "",
    caseNumber: "",
  };

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Ocultar alerta de éxito después de 5 segundos
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);

      // Fetch client info
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;

      if (!clientData) {
        setIsLoading(false);
        setError("No se encontró información del cliente");
        return;
      }

      // Fetch new residence application info
      const { data: newResidenceData /* , error: newResidenceError */ } =
        await supabase
          .from("new_residence_applications")
          .select("*")
          .eq("client_id", clientData.id)
          .maybeSingle();

      // Fetch ongoing residence process info
      const { data: ongoingProcessData /* , error: ongoingProcessError */ } =
        await supabase
          .from("ongoing_residence_processes")
          .select("*")
          .eq("client_id", clientData.id)
          .maybeSingle();

      // Combine all data
      const combinedProfile = {
        // Client info
        fullName: clientData.full_name || "",
        passportNumber: clientData.passport_number || "",
        dateOfBirth: clientData.date_of_birth || "",
        email: clientData.email || "",
        phoneNumber: clientData.phone_number || "",
        currentJob: clientData.current_job || "",
        currentAgency: clientData.current_agency || "",

        // Contact info (from various sources)
        phone: clientData.phone_number || "",
        whatsapp:
          ongoingProcessData?.whatsapp_number || clientData.phone_number || "",
        address:
          newResidenceData?.address ||
          ongoingProcessData?.current_address ||
          "",
        voivodeship:
          ongoingProcessData?.voivodato || newResidenceData?.voivodato || "",

        // New residence application info
        placeOfBirth: newResidenceData?.place_of_birth || "",
        peselNumber: newResidenceData?.pesel_number || "",
        height: newResidenceData?.height_cm
          ? String(newResidenceData.height_cm)
          : "",
        eyeColor: newResidenceData?.eye_color || "",
        hairColor: newResidenceData?.hair_color || "",
        fatherName: newResidenceData?.father_name || "",
        motherName: newResidenceData?.mother_name || "",
        maritalStatus: newResidenceData?.marital_status || "",
        educationLevel: newResidenceData?.education_level || "",
        city: newResidenceData?.city || "",
        zipCode: newResidenceData?.zip_code || "",
        euEntryDate: newResidenceData?.eu_entry_date || "",
        polandArrivalDate: newResidenceData?.poland_arrival_date || "",
        transportMethod: newResidenceData?.transport_method || "",
        traveledLast5Years: newResidenceData?.traveled_last_5_years || false,
        hasRelativesInPoland:
          newResidenceData?.has_relatives_in_poland || false,

        // Ongoing process info
        firstName: ongoingProcessData?.first_name || "",
        lastName: ongoingProcessData?.last_name || "",
        hasWorkPermit: ongoingProcessData?.has_work_permit || false,
        processStage: ongoingProcessData?.process_stage || "",
        caseNumber: ongoingProcessData?.case_number || "",
      };

      setProfile(combinedProfile);
      setEditedProfile(combinedProfile);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Error al cargar la información del perfil");
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newValidation: ValidationErrors = {};
    let isValid = true;

    // Validar campos obligatorios
    if (!editedProfile.fullName.trim()) {
      newValidation.fullName = "El nombre completo es obligatorio";
      isValid = false;
    }

    if (!editedProfile.phoneNumber.trim()) {
      newValidation.phoneNumber = "El teléfono es obligatorio";
      isValid = false;
    }

    if (!editedProfile.email.trim()) {
      newValidation.email = "El email es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editedProfile.email)) {
      newValidation.email = "Formato de email inválido";
      isValid = false;
    }

    if (!editedProfile.address.trim()) {
      newValidation.address = "La dirección es obligatoria";
      isValid = false;
    }

    if (editedProfile.city !== undefined && editedProfile.city.trim() === "") {
      newValidation.city = "La ciudad es obligatoria";
      isValid = false;
    }

    if (
      editedProfile.zipCode !== undefined &&
      editedProfile.zipCode.trim() === ""
    ) {
      newValidation.zipCode = "El código postal es obligatorio";
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Fetch client info to get the client_id
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (clientError) throw clientError;

      // Update client info
      const clientUpdateData = {
        full_name: editedProfile.fullName,
        phone_number: editedProfile.phoneNumber,
        email: editedProfile.email,
        current_job: editedProfile.currentJob,
        current_agency: editedProfile.currentAgency,
        updated_at: new Date().toISOString(),
      };

      const { error: updateClientError } = await supabase
        .from("clients")
        .update(clientUpdateData)
        .eq("id", clientData.id);

      if (updateClientError) throw updateClientError;

      // Check if new residence application exists
      const { data: newResidenceExists /* , error: checkError  */ } =
        await supabase
          .from("new_residence_applications")
          .select("id")
          .eq("client_id", clientData.id)
          .maybeSingle();

      // If new residence application exists, update it
      if (newResidenceExists) {
        const newResidenceUpdateData = {
          address: editedProfile.address,
          city: editedProfile.city,
          zip_code: editedProfile.zipCode,
          updated_at: new Date().toISOString(),
        };

        const { error: updateNewResidenceError } = await supabase
          .from("new_residence_applications")
          .update(newResidenceUpdateData)
          .eq("client_id", clientData.id);

        if (updateNewResidenceError) throw updateNewResidenceError;
      }

      // Check if ongoing process exists
      const { data: ongoingProcessExists /* , error: checkOngoingError */ } =
        await supabase
          .from("ongoing_residence_processes")
          .select("id")
          .eq("client_id", clientData.id)
          .maybeSingle();

      // If ongoing process exists, update it
      if (ongoingProcessExists) {
        const ongoingProcessUpdateData = {
          whatsapp_number: editedProfile.whatsapp,
          current_address: editedProfile.address,
          updated_at: new Date().toISOString(),
        };

        const { error: updateOngoingError } = await supabase
          .from("ongoing_residence_processes")
          .update(ongoingProcessUpdateData)
          .eq("client_id", clientData.id);

        if (updateOngoingError) throw updateOngoingError;
      }

      // Refresh profile data
      await fetchUserProfile();
      setIsEditing(false);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setValidation({});
  };

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | boolean
  ): void => {
    setEditedProfile({ ...editedProfile, [field]: value });

    // Limpiar validación del campo al editar
    if (validation[field]) {
      const newValidation = { ...validation };
      delete newValidation[field];
      setValidation(newValidation);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando información del perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerta de éxito */}
      {showSuccessAlert && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md transition-opacity duration-500">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-green-700">
                Tu información ha sido actualizada correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de actualización */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-blue-700">
              Por favor, actualiza tus datos si hay algún cambio en tu
              información personal, de contacto o laboral. Mantener la
              información actualizada nos permite llevar un proceso más prolijo
              y ordenado.
            </p>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Información Personal
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
            >
              <PencilLine className="h-4 w-4 mr-1" />
              Editar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Nombre Completo</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                        validation.fullName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {validation.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.fullName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{profile.fullName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Número de Pasaporte</p>
                <p className="font-medium">{profile.passportNumber}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium">{profile.dateOfBirth}</p>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">PESEL</p>
                <p className="font-medium">{profile.peselNumber}</p>
              </div>
            </div>

            {profile.placeOfBirth && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Lugar de Nacimiento</p>
                  <p className="font-medium">{profile.placeOfBirth}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {profile.processStage && (
              <div className="flex items-center">
                <Flag className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Etapa del Proceso</p>
                  <p className="font-medium">{profile.processStage}</p>
                </div>
              </div>
            )}

            {profile.caseNumber && (
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Número de Caso</p>
                  <p className="font-medium">{profile.caseNumber}</p>
                </div>
              </div>
            )}

            {profile.fatherName && (
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nombre del Padre</p>
                  <p className="font-medium">{profile.fatherName}</p>
                </div>
              </div>
            )}

            {profile.motherName && (
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nombre de la Madre</p>
                  <p className="font-medium">{profile.motherName}</p>
                </div>
              </div>
            )}

            {profile.maritalStatus && (
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Estado Civil</p>
                  <p className="font-medium">{profile.maritalStatus}</p>
                </div>
              </div>
            )}

            {profile.educationLevel && (
              <div className="flex items-center">
                <School className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nivel Educativo</p>
                  <p className="font-medium">{profile.educationLevel}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Información de Contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Teléfono</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                        validation.phoneNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {validation.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.phoneNumber}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{profile.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <MessageCircle className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">WhatsApp</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                    />
                  </div>
                ) : (
                  <p className="font-medium">{profile.whatsapp}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                        validation.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {validation.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Dirección</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                        validation.address
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {validation.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.address}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{profile.address}</p>
                )}
              </div>
            </div>

            {profile.city !== undefined && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Ciudad</p>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editedProfile.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                          validation.city
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                      />
                      {validation.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {validation.city}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium">{profile.city}</p>
                  )}
                </div>
              </div>
            )}

            {profile.zipCode !== undefined && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Código Postal</p>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editedProfile.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                          validation.zipCode
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                      />
                      {validation.zipCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {validation.zipCode}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium">{profile.zipCode}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Voivodato</p>
                <p className="font-medium">
                  {profile.voivodeship || "No asignado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Laboral */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Información Laboral
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Building2 className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Trabajo Actual</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.currentJob}
                      onChange={(e) =>
                        handleInputChange("currentJob", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Ingresa tu trabajo actual"
                    />
                  </div>
                ) : (
                  <p className="font-medium">
                    {profile.currentJob || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <Building2 className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Agencia Actual</p>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedProfile.currentAgency}
                      onChange={(e) =>
                        handleInputChange("currentAgency", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Ingresa tu agencia actual"
                    />
                  </div>
                ) : (
                  <p className="font-medium">
                    {profile.currentAgency || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            {profile.hasWorkPermit !== undefined && (
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Permiso de Trabajo</p>
                  <p className="font-medium">
                    {profile.hasWorkPermit ? "Sí" : "No"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {profile.euEntryDate && (
              <div className="flex items-center">
                <Plane className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Fecha de Entrada a la UE
                  </p>
                  <p className="font-medium">{profile.euEntryDate}</p>
                </div>
              </div>
            )}

            {profile.polandArrivalDate && (
              <div className="flex items-center">
                <Plane className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Fecha de Llegada a Polonia
                  </p>
                  <p className="font-medium">{profile.polandArrivalDate}</p>
                </div>
              </div>
            )}

            {profile.transportMethod && (
              <div className="flex items-center">
                <Plane className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Método de Transporte</p>
                  <p className="font-medium">{profile.transportMethod}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
