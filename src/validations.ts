/**
 *
 * @param message Mensaje de la hoja de planilla de excel
 * @returns Lista de variables requeridas para el mensaje
 * @example
 * // returns ["nombre_completo", "mail"]
 * getRequiredVariables("Hola {{nombre_completo}}. Tu cuenta con mail {{mail}} fue creada con éxito")
 */

export const getRequiredVariables = (message: string): string[] => {
  throw new Error("Not implemented");
};

/**
 *
 * @param data Datos necesarios para validar las variables requeridas
 * @returns Resultado de la validación
 * @example
 * // returns { success: true, missingVariables: [] }
 * validateVariables({ requiredVariables: ["nombre_completo", "mail"], availableVariables: ["nombre_completo", "mail", "dirección"] })
 * @example
 * // returns { success: false, missingVariables: ["dirección"] }
 * validateVariables({ requiredVariables: ["nombre_completo", "dirección"], availableVariables: ["nombre_completo", "mail"] })
 */
export const validateVariables = (data: {
  requiredVariables: string[];
  availableVariables: string[];
}): {
  success: boolean;
  missingVariables: string[];
} => {
    // TODO: Asegurar que también esté la columna del teléfono.
  throw new Error("Not implemented");
};
