import {
  ExcelMessageOption,
  ExtractedRow,
  GetDataFromSheetConfig,
} from "./types/Excel";

/**
 * Función que devuelve una lista de hojas de la planilla de excel con el nombre de la hoja
 * @param fileName Nombre del archivo de la planilla de excel
 * @param exceptions Hojas a excluir de la lista de hojas disponibles
 */
export const getAvailableSheets = async (
  fileName: string,
  exceptions: string[] = []
): Promise<string[]> => {
  throw new Error("Not implemented");
};

/**
 * Función que devuelve una lista de mensajes de la hoja de planilla de excel
 * @param data Datos necesarios para obtener los mensajes de la hoja de planilla
 * @returns Lista de mensajes de la hoja de planilla con nombre y mensaje
 * @example { title: "Mensaje de bienvenida", message: "Hola, {{nombre_completo}} ¿cómo estás?. Bienvenido!" }
 *
 */
export const getAvailableMessages = async (
  data: GetDataFromSheetConfig
): Promise<ExcelMessageOption[]> => {
  throw new Error("Not implemented");
};

/**
 * Función que devuelve una lista de columnas de la hoja de planilla de excel
 * @param data Datos necesarios para extraer las columnas de la hoja de planilla
 * @returns Lista de columnas de la hoja de planilla
 *
 */
export const extractColumnsFromSheet = async (
  data: GetDataFromSheetConfig
): Promise<string[]> => {
  throw new Error("Not implemented");
};

/**
 *
 * @param data Datos necesarios para obtener los datos de la hoja de planilla
 * @returns Lista de objetos con las columnas de la hoja de planilla
 */
export const getDataFromSheet = async (
  data: GetDataFromSheetConfig
): Promise<ExtractedRow[]> => {
  const { sheet, filename } = data;
  throw new Error("Not implemented");
};
