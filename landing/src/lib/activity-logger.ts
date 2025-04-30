// Archivo: lib/activity-logger.ts
// Este archivo contiene funciones para registrar actividades de usuarios en la tabla activity_logs

import { supabase } from "./supabase/client";
import { Client } from "../types/types";

/**
 * Registra una actividad de usuario en la tabla activity_logs
 */
export async function logUserActivity(
  clientId: string, 
  activityType: string, 
  description: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        client_id: clientId,
        activity_type: activityType,
        description: description,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error al registrar actividad:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error al registrar actividad:", error);
    return false;
  }
}

/**
 * Registra actividad cuando un usuario actualiza su perfil personal
 */
export async function logProfileUpdate(
  client: Client, 
  updatedFields: string[]
): Promise<void> {
  const fieldNames = updatedFields.join(", ");
  await logUserActivity(
    client.id,
    "Actualización de perfil",
    `${client.full_name} actualizó sus datos: ${fieldNames}`
  );
}

/**
 * Registra actividad cuando un usuario actualiza información del proceso de residencia
 */
export async function logProcessUpdate(
  clientId: string,
  clientName: string,
  processType: "new" | "ongoing",
  updatedFields: string[]
): Promise<void> {
  const processTypeName = processType === "new" ? "nueva solicitud" : "proceso en curso";
  const fieldNames = updatedFields.join(", ");
  
  await logUserActivity(
    clientId,
    "Actualización de proceso",
    `${clientName} actualizó su ${processTypeName}: ${fieldNames}`
  );
}

/**
 * Registra actividad cuando un usuario sube un documento
 */
export async function logDocumentUpload(
  clientId: string,
  clientName: string,
  documentType: string
): Promise<void> {
  await logUserActivity(
    clientId,
    "Subida de documento",
    `${clientName} subió un documento: ${documentType}`
  );
}

/**
 * Registra actividad cuando un usuario realiza un pago
 */
export async function logPayment(
  clientId: string,
  clientName: string,
  amount: number,
  referenceNumber: string
): Promise<void> {
  await logUserActivity(
    clientId,
    "Pago realizado",
    `${clientName} realizó un pago de ${amount} PLN (Ref: ${referenceNumber})`
  );
}

/**
 * Registra actividad cuando un usuario abre un ticket de soporte
 */
export async function logTicketCreation(
  clientId: string,
  clientName: string,
  ticketSubject: string,
  ticketNumber: string
): Promise<void> {
  await logUserActivity(
    clientId,
    "Nuevo ticket",
    `${clientName} abrió ticket #${ticketNumber}: ${ticketSubject}`
  );
}

/**
 * Registra actividad cuando un usuario responde a un ticket
 */
export async function logTicketReply(
  clientId: string,
  clientName: string,
  ticketNumber: string
): Promise<void> {
  await logUserActivity(
    clientId,
    "Respuesta a ticket",
    `${clientName} respondió al ticket #${ticketNumber}`
  );
}