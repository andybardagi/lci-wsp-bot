import { ExcelMessageOption } from "./types/Excel";

/**
 * Función que permite al usuario seleccionar una hoja de la planilla de excel de las listadas como disponibles
 * @param sheets Lista de hojas de la planilla de excel que el usuario puede seleccionar
 */
export const selectSheetPrompt = (sheets: string[]): string => {
  throw new Error("Not implemented");
};

/**
 *
 * @param messages Lista de mensajes de la hoja de planilla de excel que el usuario puede seleccionar
 * @returns Mensaje seleccionado por el usuario
 */
export const selectMessagePrompt = (
  messages: ExcelMessageOption[]
): ExcelMessageOption => {
  throw new Error("Not implemented");
};
