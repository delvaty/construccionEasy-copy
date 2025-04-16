import React, { useEffect, useState } from "react";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { FormRadio } from "../components/FormRadio";
import { FileUpload } from "../components/FileUpload";
import { ProgressBar } from "../components/ProgressBar";
import {
  FormData,
  FormStep,
  initialFormData,
  TattooDetail,
  RelativeDetail,
  TravelDetail,
} from "../types/types"; // Added TravelDetail
import {
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Send,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase/client";
import DuplicatePassportModal from "../components/DuplicatePassportModal";

// Helper to generate unique IDs
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const Form: React.FC= () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [formType, setFormType] = useState<FormStep>("selection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
const [isPassportDuplicate, setIsPassportDuplicate] = useState(false);
// Nuevo estado para controlar si el usuario ya ha completado un formulario
const [hasCompletedForm, setHasCompletedForm] = useState(false);

// Verificar si el usuario ya completó un formulario al cargar el componente
useEffect(() => {
  const checkUserFormStatus = async () => {
    try {
      // Obtener la sesión del usuario actual
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        console.log("No hay sesión de usuario");
        return;
      }
      
      // Consultar si el usuario ya ha completado un formulario
      const { data, error } = await supabase
        .from("clients")
        .select("has_completed_form")
        .eq("user_id", userId)
        .limit(1);
      
      if (error) {
        console.error("Error al verificar estado del formulario:", error);
        return;
      }
      
      // Si hay datos y has_completed_form es true, actualizar el estado
      if (data && data.length > 0 && data[0].has_completed_form === true) {
        setHasCompletedForm(true);
        // Mostrar el modal si ya completó un formulario
        setIsDuplicateModalOpen(true);
      }
    } catch (error) {
      console.error("Error al verificar estado del formulario:", error);
    }
  };
  
  checkUserFormStatus();
}, []);

/* const checkPassportExists = async (passportNumber: string) => {
    try {
        if (!passportNumber || passportNumber.trim() === '') {
          return false;
        }
        
        // Obtener la sesión del usuario
        const { data: sessionData } = await supabase.auth.getSession();
        
        // Verifica si hay una sesión activa
        if (!sessionData?.session?.user?.id) {
          console.log("No hay sesión de usuario");
          return false;
        }
        
        // Log para debugging
        console.log("Verificando pasaporte:", passportNumber);
        
        // Realizar la consulta a la base de datos
        const { data, error } = await supabase
          .from("clients")
          .select("id, passport_number")
          .eq("passport_number", passportNumber)
          .limit(1);
        
        // Manejo de errores en la consulta
        if (error) {
          console.error("Error al verificar pasaporte:", error);
          return false;
        }
        
        // Debugging para ver qué devuelve la consulta
        console.log("Resultado de la consulta:", data);
        
        // Verificar si hay resultados
        const exists = data && data.length > 0;
        console.log("¿Existe el pasaporte?", exists);
        
        return exists;
      } catch (error) {
        console.error("Error inesperado al verificar pasaporte:", error);
        return false;
      }
  }; */

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    /* if (name === "passportNumber") {
        // Verificar después de que el usuario haya ingresado suficientes caracteres
        if (value && value.trim().length >= 3) {
          console.log("Verificando pasaporte:", value);
          const exists = await checkPassportExists(value);
          
          // Actualizar el estado según el resultado
          setIsPassportDuplicate(exists);
          if (exists) {
            setIsDuplicateModalOpen(true);
          }
        }
      } */
  };

  const handleFileChange = (name: string) => (file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleRadioChange = (name: keyof FormData) => (value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Tattoo Handlers ---
  const handleAddTattoo = () => {
    setFormData((prev) => ({
      ...prev,
      tattoos: [...prev.tattoos, { id: generateId(), location: "" }],
    }));
  };

  const handleTattooChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tattoos: prev.tattoos.map((tattoo) =>
        tattoo.id === id ? { ...tattoo, location: value } : tattoo
      ),
    }));
  };

  const handleRemoveTattoo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tattoos: prev.tattoos.filter((tattoo) => tattoo.id !== id),
    }));
  };

  // --- Relative Handlers ---
  const handleAddRelative = () => {
    setFormData((prev) => ({
      ...prev,
      relatives: [
        ...prev.relatives,
        {
          id: generateId(),
          relationship: "",
          full_name: "",
          residency_status: "",
        },
      ],
    }));
  };

  const handleRelativeChange = (
    id: string,
    field: keyof Omit<RelativeDetail, "id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      relatives: prev.relatives.map((relative) =>
        relative.id === id ? { ...relative, [field]: value } : relative
      ),
    }));
  };

  const handleRemoveRelative = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      relatives: prev.relatives.filter((relative) => relative.id !== id),
    }));
  };

  // --- Travel Handlers ---
  const handleAddTravel = () => {
    setFormData((prev) => ({
      ...prev,
      travels: [
        ...prev.travels,
        {
          id: generateId(),
          start_date: "",
          end_date: "",
          country: "",
          reason: "",
        },
      ],
    }));
  };

  const handleTravelChange = (
    id: string,
    field: keyof Omit<TravelDetail, "id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      travels: prev.travels.map((travel) =>
        travel.id === id ? { ...travel, [field]: value } : travel
      ),
    }));
  };

  const handleRemoveTravel = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      travels: prev.travels.filter((travel) => travel.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation check for conditional fields before proceeding
    if (hasCompletedForm) {
      setIsDuplicateModalOpen(true);
      return;
    }

    if (formType === "new") {
      if (
        formData.hasTattoos === true &&
        formData.tattoos.some((t) => !t.location.trim())
      ) {
        alert("Por favor, complete la ubicación de todos los tatuajes.");
        return;
      }
      if (
        formData.relativesInPoland === true &&
        formData.relatives.some(
          (r) =>
            !r.relationship.trim() ||
            !r.full_name.trim() ||
            !r.residency_status.trim()
        )
      ) {
        alert("Por favor, complete todos los detalles de los familiares.");
        return;
      }
      if (
        formData.hasTraveledLastFiveYears === true &&
        formData.travels.some(
          (t) =>
            !t.start_date.trim() ||
            !t.end_date.trim() ||
            !t.country.trim() ||
            !t.reason.trim()
        )
      ) {
        alert("Por favor, complete todos los detalles de los viajes.");
        return;
      }
    }

    if (currentStep < getTotalSteps()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      /* console.log("Formulario enviado:", formData);
      // Show success message instead of alert
      setCurrentStep((prev) => prev + 1); */

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        // Guardar los datos en Supabase según el tipo de formulario
        if (formType === "new") {
          await saveNewResidenceApplication();
        } else if (formType === "ongoing") {
          await saveOngoingResidenceProcess();
        }

        console.log("Formulario enviado con éxito");
        setSubmitSuccess(true);
        setCurrentStep((prev) => prev + 1); // Avanzar al paso de éxito
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Error al enviar el formulario"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Función para guardar un nuevo proceso de residencia
  const saveNewResidenceApplication = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    // 1. Primero, crear el cliente básico
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        full_name: formData.fullName,
        passport_number: formData.passportNumber,
        date_of_birth: formData.dateOfBirth,
        email: formData.email,
        phone_number: formData.phoneNumber,
        current_job: formData.currentJob,
        current_agency: formData.currentAgencyName,
        user_id: userId,
        has_completed_form: true
      })
      .select();

    if (clientError)
      throw new Error(`Error al crear cliente: ${clientError.message}`);

    const clientId = clientData[0].id;

    // 2. Insertar información extendida del cliente
    const { error: extendedInfoError } = await supabase
      .from("new_residence_applications")
      .insert({
        client_id: clientId,
        place_of_birth: formData.placeOfBirth,
        pesel_number: formData.peselNumber,
        height_cm: parseInt(formData.height),
        eye_color: formData.eyeColor,
        hair_color: formData.hairColor,
        has_tattoos: formData.hasTattoos,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        marital_status: formData.maritalStatus,
        education_level: formData.educationLevel,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        eu_entry_date: formData.euEntryDate,
        poland_arrival_date: formData.polandArrivalDate,
        transport_method: formData.transportMethod,
        traveled_last_5_years: formData.hasTraveledLastFiveYears,
        has_relatives_in_poland: formData.relativesInPoland,
      });

    if (extendedInfoError)
      throw new Error(
        `Error al guardar información adicional: ${extendedInfoError.message}`
      );

    // 3. Subir el documento de pasaporte si existe
    if (formData.passportFile) {
      try {
        const passportFilePath = await uploadFile(
          clientId,
          "passport",
          formData.passportFile
        );
        console.log(`Pasaporte subido correctamente: ${passportFilePath}`);
      } catch (error) {
        console.error("Error al subir pasaporte:", error);
        throw error;
      }
      /* await uploadFile(clientId, "passport", formData.passportFile); */
    }

    // 4. Opcional: Guardar detalles adicionales (tatuajes, viajes, familiares)
    if (formData.hasTattoos && formData.tattoos.length > 0) {
      await saveTattooDetails(clientId, formData.tattoos);
    }

    if (formData.hasTraveledLastFiveYears && formData.travels.length > 0) {
      await saveTravelDetails(clientId, formData.travels);
    }

    if (formData.relativesInPoland && formData.relatives.length > 0) {
      await saveRelativeDetails(clientId, formData.relatives);
    }
  };

  // Función para guardar un proceso de residencia en curso
  const saveOngoingResidenceProcess = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    // 1. Primero, crear el cliente básico
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        full_name: formData.fullName,
        passport_number: formData.passportNumber,
        date_of_birth: formData.dateOfBirth,
        email: formData.email,
        phone_number: formData.phoneNumber,
        current_job: formData.currentJob,
        user_id: userId,
        has_completed_form: true
      })
      .select();

    if (clientError)
      throw new Error(`Error al crear cliente: ${clientError.message}`);

    const clientId = clientData[0].id;

    // 2. Insertar la información del proceso en curso
    const { error: processError } = await supabase
      .from("ongoing_residence_processes")
      .insert({
        client_id: clientId,
        first_name: formData.fullName.split(" ")[0], // Esto es simplificado, podrías necesitar una solución más robusta
        last_name:
          formData.lastName || formData.fullName.split(" ").slice(1).join(" "),
        has_work_permit: formData.hasWorkPermit,
        voivodato: formData.voivodeship,
        process_stage: formData.processStage,
        case_number: formData.caseNumber,
        current_address: formData.currentAddress,
        whatsapp_number: formData.whatsappNumber,
      });

    if (processError)
      throw new Error(`Error al guardar proceso: ${processError.message}`);

    // 3. Subir documentos
    if (formData.passportFile) {
      try {
        await uploadFile(clientId, "passport", formData.passportFile);
      } catch (error) {
        console.error("Error al subir pasaporte:", error);
        throw error;
      }
      /* await uploadFile(clientId, "passport", formData.passportFile); */
    }

    if (formData.yellowCard) {
      try {
        await uploadFile(clientId, "yellow_card", formData.yellowCard);
      } catch (error) {
        console.error("Error al subir tarjeta amarilla:", error);
        throw error;
      }
      /* await uploadFile(clientId, "yellow_card", formData.yellowCard); */
    }
  };

  // Función para subir archivos a Supabase Storage
  const uploadFile = async (
    clientId: string,
    documentType: string,
    file: File
  ) => {
    // Obtener el usuario actual
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!sessionData) {
      throw new Error(
        "Usuario no autenticado. Por favor, inicie sesión para continuar."
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${clientId}_${documentType}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(filePath, file);

    if (uploadError)
      throw new Error(`Error al subir archivo: ${uploadError.message}`);

    // Registrar el documento en la tabla client_documents
    const { error: docError } = await supabase.from("client_documents").insert({
      client_id: clientId,
      document_type: documentType,
      file_path: filePath,
      file_name: file.name,

      /* user_id: userId, */
    });

    if (docError)
      throw new Error(`Error al registrar documento: ${docError.message}`);
    return filePath;
  };

  // Funciones para guardar detalles adicionales (opcional)
  const saveTattooDetails = async (
    clientId: string,
    tattoos: TattooDetail[]
  ) => {
    const tattooInserts = tattoos.map((tattoo) => ({
      client_id: clientId,
      location: tattoo.location,
    }));

    if (tattooInserts.length > 0) {
      const { error } = await supabase
        .from("client_tattoos")
        .insert(tattooInserts);

      if (error) throw new Error(`Error al guardar tatuajes: ${error.message}`);
    }
  };

  const saveTravelDetails = async (
    clientId: string,
    travels: TravelDetail[]
  ) => {
    const travelInserts = travels.map((travel) => ({
      client_id: clientId,
      start_date: travel.start_date,
      end_date: travel.end_date,
      country: travel.country,
      reason: travel.reason,
    }));

    if (travelInserts.length > 0) {
      const { error } = await supabase
        .from("client_travels")
        .insert(travelInserts);

      if (error) throw new Error(`Error al guardar viajes: ${error.message}`);
    }
  };

  const saveRelativeDetails = async (
    clientId: string,
    relatives: RelativeDetail[]
  ) => {
    const relativeInserts = relatives.map((relative) => ({
      client_id: clientId,
      relationship: relative.relationship,
      full_name: relative.full_name,
      residency_status: relative.residency_status,
    }));

    if (relativeInserts.length > 0) {
      const { error } = await supabase
        .from("client_relatives")
        .insert(relativeInserts);

      if (error)
        throw new Error(`Error al guardar familiares: ${error.message}`);
    }
  };

  // Renderizar un mensaje de éxito después del envío
  const renderSuccessMessage = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        ¡Registro Completado!
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Su información ha sido enviada correctamente. Nos pondremos en contacto
        con usted pronto.
      </p>
      <button
      onClick={() => {
        window.location.href = "http://localhost:5174/";
      }}
        /* onClick={() => {
          setFormType("selection");
          setCurrentStep(1);
          setFormData(initialFormData);
          setSubmitSuccess(false);
        }} */
        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Ir al panel de cliente
      </button>
    </div>
  );

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getTotalSteps = () => {
    if (formType === "new") return 7;
    if (formType === "ongoing") return 7;
    return 1; // Only selection step
  };

  const renderSelectionScreen = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Seleccione el Tipo de Proceso
      </h2>
      <div className="space-y-4">
        <label
          className={`block p-6 border rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
            formData.processType === "new"
              ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="processType"
            value="new"
            checked={formData.processType === "new"}
            onChange={(e) => {
              handleInputChange(e);
              setFormType("new");
              setCurrentStep(1);
              // Reset conditional fields when switching form type
              setFormData((prev) => ({
                ...initialFormData,
                processType: "new",
              })); // Reset to initial but keep type
            }}
            className="mr-3 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="font-medium text-gray-700">
            Necesito iniciar un nuevo proceso de residencia
          </span>
        </label>
        <label
          className={`block p-6 border rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
            formData.processType === "ongoing"
              ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="processType"
            value="ongoing"
            checked={formData.processType === "ongoing"}
            onChange={(e) => {
              handleInputChange(e);
              setFormType("ongoing");
              setCurrentStep(1);
              // Reset conditional fields when switching form type
              setFormData((prev) => ({
                ...initialFormData,
                processType: "ongoing",
              })); // Reset to initial but keep type
            }}
            className="mr-3 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="font-medium text-gray-700">
            Ya tengo un proceso de residencia en curso
          </span>
        </label>
      </div>
    </div>
  );

  // Helper to render form sections consistently
  const renderFormSection = (title: string, children: React.ReactNode) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">
        {title}
      </h3>
      {children}
    </div>
  );

  const renderNewProcessForm = () => {
    switch (currentStep) {
      case 1: // Información Personal
        return renderFormSection(
          "Información Personal",
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nombre Completo"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <FormInput
                label="Número de Pasaporte"
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
              />
              <FormInput
                label="Lugar de Nacimiento"
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
              />
              <FormInput
                label="Fecha de Nacimiento"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <FormInput
                label="Número PESEL"
                type="text"
                name="peselNumber"
                value={formData.peselNumber}
                onChange={handleInputChange}
              />
              <FormInput
                label="Altura (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
              />
              <FormSelect
                label="Color de Ojos"
                name="eyeColor"
                value={formData.eyeColor}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccione..." },
                  { value: "brown", label: "Marrón" },
                  { value: "blue", label: "Azul" },
                  { value: "green", label: "Verde" },
                  { value: "hazel", label: "Avellana" },
                ]}
              />
              <FormSelect
                label="Color de Pelo"
                name="hairColor"
                value={formData.hairColor}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccione..." },
                  { value: "black", label: "Negro" },
                  { value: "brown", label: "Marrón" },
                  { value: "blonde", label: "Rubio" },
                  { value: "red", label: "Pelirrojo" },
                  { value: "gray", label: "Gris" },
                ]}
              />
              {/* Tattoo Question - Spans full width */}
              <div className="md:col-span-2">
                <FormRadio
                  label="¿Tienes tatuajes?"
                  name="hasTattoos"
                  value={formData.hasTattoos}
                  onChange={handleRadioChange("hasTattoos")}
                />
              </div>
            </div>

            {/* Conditional Tattoo Section */}
            {formData.hasTattoos === true && (
              <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4 md:col-span-2">
                <h4 className="text-md font-medium text-gray-600">
                  Detalles de Tatuajes
                </h4>
                {formData.tattoos.map((tattoo, index) => (
                  <div key={tattoo.id} className="flex items-end space-x-3">
                    <div className="flex-grow">
                      <FormInput
                        label={`Ubicación Tatuaje #${index + 1}`}
                        type="text"
                        name={`tattoo_location_${tattoo.id}`}
                        value={tattoo.location}
                        onChange={(e) =>
                          handleTattooChange(tattoo.id, e.target.value)
                        }
                        placeholder="Ej: Brazo izquierdo, espalda"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTattoo(tattoo.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                      aria-label="Eliminar tatuaje"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTattoo}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Tatuaje
                </button>
              </div>
            )}
          </>
        );
      case 2: // Información Familiar
        return renderFormSection(
          "Información Familiar",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre del Padre"
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
            />
            <FormInput
              label="Nombre de la Madre"
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
            />
            <FormSelect
              label="Estado Civil"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "single", label: "Soltero/a" },
                { value: "married", label: "Casado/a" },
                { value: "divorced", label: "Divorciado/a" },
                { value: "widowed", label: "Viudo/a" },
              ]}
            />
            <FormSelect
              label="Nivel de Educación"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "primary", label: "Primaria" },
                { value: "secondary", label: "Secundaria" },
                { value: "bachelor", label: "Licenciatura" },
                { value: "master", label: "Maestría" },
                { value: "phd", label: "Doctorado" },
              ]}
            />
          </div>
        );
      case 3: // Información de Contacto
        return renderFormSection(
          "Información de Contacto",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número de Teléfono"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Dirección"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <FormInput
              label="Ciudad"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <FormInput
              label="Código Postal"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        );
      case 4: // Información de Viaje y Trabajo
        return renderFormSection(
          "Información de Viaje y Trabajo",
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Fecha de Entrada a la UE"
                type="date"
                name="euEntryDate"
                value={formData.euEntryDate}
                onChange={handleInputChange}
              />
              <FormInput
                label="Fecha de Llegada a Polonia"
                type="date"
                name="polandArrivalDate"
                value={formData.polandArrivalDate}
                onChange={handleInputChange}
              />
              <FormSelect
                label="Método de Transporte"
                name="transportMethod"
                value={formData.transportMethod}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccione..." },
                  { value: "air", label: "Aéreo" },
                  { value: "land", label: "Terrestre" },
                  { value: "sea", label: "Marítimo" },
                ]}
              />
              {/* Travel Question - Changed to Radio */}
              <div className="md:col-span-2">
                <FormRadio
                  label="¿Ha viajado fuera de su país de origen en los últimos 5 años (excluyendo Polonia)?"
                  name="hasTraveledLastFiveYears"
                  value={formData.hasTraveledLastFiveYears}
                  onChange={handleRadioChange("hasTraveledLastFiveYears")}
                />
              </div>
              <FormInput
                label="Nombre de la Agencia Actual"
                type="text"
                name="currentAgencyName"
                value={formData.currentAgencyName}
                onChange={handleInputChange}
              />
              <FormInput
                label="Trabajo Actual"
                type="text"
                name="currentJob"
                value={formData.currentJob}
                onChange={handleInputChange}
              />
              {/* Relatives Question - Spans full width */}
              <div className="md:col-span-2">
                <FormRadio
                  label="¿Tienes familiares en Polonia?"
                  name="relativesInPoland"
                  value={formData.relativesInPoland}
                  onChange={handleRadioChange("relativesInPoland")}
                />
              </div>
            </div>

            {/* Conditional Travel Section */}
            {formData.hasTraveledLastFiveYears === true && (
              <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4 md:col-span-2">
                <h4 className="text-md font-medium text-gray-600">
                  Detalles de Viajes en los Últimos 5 Años
                </h4>
                {formData.travels.map((travel, index) => (
                  <div
                    key={travel.id}
                    className="p-3 border border-gray-100 rounded space-y-3 relative bg-white shadow-sm"
                  >
                    <h5 className="text-sm font-semibold text-gray-800">
                      Viaje #{index + 1}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormInput
                        label="Fecha Desde"
                        type="date"
                        name={`travel_startDate_${travel.id}`}
                        value={travel.start_date}
                        onChange={(e) =>
                          handleTravelChange(
                            travel.id,
                            "start_date",
                            e.target.value
                          )
                        }
                      />
                      <FormInput
                        label="Fecha Hasta"
                        type="date"
                        name={`travel_endDate_${travel.id}`}
                        value={travel.end_date}
                        onChange={(e) =>
                          handleTravelChange(
                            travel.id,
                            "end_date",
                            e.target.value
                          )
                        }
                      />
                      <FormInput
                        label="País"
                        type="text"
                        name={`travel_country_${travel.id}`}
                        value={travel.country}
                        onChange={(e) =>
                          handleTravelChange(
                            travel.id,
                            "country",
                            e.target.value
                          )
                        }
                        placeholder="Nombre del país"
                      />
                      <FormSelect
                        label="Motivo"
                        name={`travel_reason_${travel.id}`}
                        value={travel.reason}
                        onChange={(e) =>
                          handleTravelChange(
                            travel.id,
                            "reason",
                            e.target.value
                          )
                        }
                        options={[
                          { value: "", label: "Seleccione..." },
                          { value: "tourism", label: "Turismo" },
                          { value: "work", label: "Trabajo" },
                          { value: "other", label: "Otros" },
                        ]}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTravel(travel.id)}
                      className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                      aria-label="Eliminar viaje"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTravel}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Viaje
                </button>
              </div>
            )}

            {/* Conditional Relatives Section */}
            {formData.relativesInPoland === true && (
              <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4 md:col-span-2">
                <h4 className="text-md font-medium text-gray-600">
                  Detalles de Familiares en Polonia
                </h4>
                {formData.relatives.map((relative, index) => (
                  <div
                    key={relative.id}
                    className="p-3 border border-gray-100 rounded space-y-3 relative bg-white shadow-sm"
                  >
                    <h5 className="text-sm font-semibold text-gray-800">
                      Familiar #{index + 1}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormInput
                        label="Relación"
                        type="text"
                        name={`relative_relationship_${relative.id}`}
                        value={relative.relationship}
                        onChange={(e) =>
                          handleRelativeChange(
                            relative.id,
                            "relationship",
                            e.target.value
                          )
                        }
                        placeholder="Ej: Padre, Hermano"
                      />
                      <FormInput
                        label="Nombre Completo"
                        type="text"
                        name={`relative_fullName_${relative.id}`}
                        value={relative.full_name}
                        onChange={(e) =>
                          handleRelativeChange(
                            relative.id,
                            "full_name",
                            e.target.value
                          )
                        }
                        placeholder="Nombre y Apellido"
                      />
                      <FormSelect
                        label="Estado Residencia"
                        name={`relative_residency_${relative.id}`}
                        value={relative.residency_status}
                        onChange={(e) =>
                          handleRelativeChange(
                            relative.id,
                            "residency_status",
                            e.target.value
                          )
                        }
                        options={[
                          { value: "", label: "Seleccione..." },
                          { value: "yes_temp", label: "Sí (Temporal)" },
                          { value: "yes_perm", label: "Sí (Permanente)" },
                          { value: "in_progress", label: "En Proceso" },
                          { value: "no", label: "No" },
                          { value: "unknown", label: "Desconocido" },
                        ]}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRelative(relative.id)}
                      className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                      aria-label="Eliminar familiar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRelative}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Familiar
                </button>
              </div>
            )}
          </>
        );
      case 5: // Documentos
        return renderFormSection(
          "Documentos",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileUpload
                label="Subir Pasaporte"
                name="passportFile"
                onChange={handleFileChange("passportFile")}
                required={true}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOngoingProcessForm = () => {
    // NOTE: Conditional logic for tattoos/relatives/travel is currently only in the 'new' process flow.
    // Add similar logic here if needed for the 'ongoing' process.
    switch (currentStep) {
      case 1:
        return renderFormSection(
          "Información Personal",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <FormInput
              label="Apellidos"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <FormInput
              label="Fecha de Nacimiento"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número de Pasaporte"
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
            />
          </div>
        );
      case 2:
        return renderFormSection(
          "Información Laboral",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Trabajo Actual"
              type="text"
              name="currentJob"
              value={formData.currentJob}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <FormRadio
                label="¿Tienes permiso de trabajo?"
                name="hasWorkPermit"
                value={formData.hasWorkPermit}
                onChange={handleRadioChange("hasWorkPermit")}
              />
            </div>
          </div>
        );
      case 3:
        return renderFormSection(
          "Información del Proceso",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Voivodato"
              name="voivodeship"
              value={formData.voivodeship}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "dolnoslaskie", label: "Baja Silesia" },
                { value: "kujawsko-pomorskie", label: "Cuyavia-Pomerania" },
                { value: "lubelskie", label: "Lublin" },
                { value: "lubuskie", label: "Lubusz" },
                { value: "lodzkie", label: "Łódź" },
                { value: "malopolskie", label: "Pequeña Polonia" },
                { value: "mazowieckie", label: "Mazovia" },
                { value: "opolskie", label: "Opole" },
                { value: "podkarpackie", label: "Subcarpacia" },
                { value: "podlaskie", label: "Podlaquia" },
                { value: "pomorskie", label: "Pomerania" },
                { value: "slaskie", label: "Silesia" },
                { value: "swietokrzyskie", label: "Santa Cruz" },
                { value: "warminsko-mazurskie", label: "Varmia-Masuria" },
                { value: "wielkopolskie", label: "Gran Polonia" },
                { value: "zachodniopomorskie", label: "Pomerania Occidental" },
                { value: "unknown", label: "Desconocido" },
              ]}
            />
            <FormSelect
              label="Etapa del Proceso"
              name="processStage"
              value={formData.processStage}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "submitted", label: "Solicitud Presentada" },
                { value: "yellow-card", label: "Tarjeta Amarilla" },
                { value: "red-stamp", label: "Sello Rojo" },
                { value: "negative", label: "Negativo" },
                { value: "unknown", label: "Desconocido" },
              ]}
            />
            <FormInput
              label="Número de Caso (Opcional)"
              type="text"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={handleInputChange}
              required={false}
            />
          </div>
        );
      case 4:
        return renderFormSection(
          "Información de Contacto",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Número de Teléfono"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número de WhatsApp"
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Dirección Actual"
                type="text"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
              />
            </div>
            <FormInput
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        );
      case 5:
        return renderFormSection(
          "Documentos",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileUpload
                label="Subir Pasaporte"
                name="passportFile"
                onChange={handleFileChange("passportFile")}
              />
            </div>
            <div className="md:col-span-2">
              <FileUpload
                label="Tarjeta Amarilla (Opcional)"
                name="yellowCard"
                onChange={handleFileChange("yellowCard")}
                required={false}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <ClipboardList className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Registro de Proceso de Residencia
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Complete los pasos para registrar su proceso.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {formType !== "selection" && !submitSuccess && (
            <div className="mb-8">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={getTotalSteps()}
              />
            </div>
          )}
          {hasCompletedForm ? (
        <DuplicatePassportModal 
          isOpen={isDuplicateModalOpen}
          onClose={() => setIsDuplicateModalOpen(false)}
        />
      ) : null}

          {submitSuccess ? (
            renderSuccessMessage()
          ) :  (
            <form onSubmit={handleSubmit} className="space-y-8">
              {formType === "selection" && renderSelectionScreen()}
              {formType === "new" && renderNewProcessForm()}
              {formType === "ongoing" && renderOngoingProcessForm()}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {submitError}
                </div>
              )}

              {formType !== "selection" && (
                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-4 sm:mb-0"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                      Anterior
                    </button>
                  ) : (
                    <div className="w-full sm:w-auto mb-4 sm:mb-0"></div> // Placeholder to maintain layout
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
                    disabled={isSubmitting || isPassportDuplicate}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Procesando...
                      </>
                    ) : isPassportDuplicate ? (
                        "Proceso existente"
                      ) : currentStep === getTotalSteps() ? (
                      <>
                        Enviar{" "}
                        <Send className="ml-2 h-5 w-5" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Siguiente{" "}
                        <ArrowRight
                          className="ml-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
      
    </div>
  );
}

export default Form;
