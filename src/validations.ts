/**
 *
 * @param message Mensaje de la hoja de planilla de excel
 * @returns Lista de variables requeridas para el mensaje
 * @example
 * // returns ["nombre_completo", "mail"]
 * getRequiredVariables("Hola {{nombre_completo}}. Tu cuenta con mail {{mail}} fue creada con éxito")
 */
export const getRequiredVariables = (message: string): string[] => {
  const requiredVariables = message.match(/{{(.*?)}}/g);

  if (!requiredVariables) {
    return [];
  }

  return requiredVariables.map((v) => v.replace("{{", "").replace("}}", ""));
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
  const availableVariables = data.availableVariables.map(v => cleanString(v));
  const requiredVariables = data.requiredVariables.map(v => cleanString(v));

  const hasColumPhone = availableVariables.some((v) => v === "telefono");
  if (hasColumPhone) {
    return {
      success: false,
      missingVariables: ["telefono"],
    };
  }

  const missingVariables = requiredVariables.filter(
    (requiredVariable) =>
      !availableVariables.some((availableVariable) =>
        validateStringEquals(requiredVariable, availableVariable)
      )
  );

  return {
    success: missingVariables.length === 0,
    missingVariables,
  };
};

export const validateStringEquals = (
  string1: string,
  string2: string
): boolean => {
  return String(string1).toLowerCase() === String(string2).toLowerCase();
};

export const cleanString = (string: unknown): string => {
  return String(string)
    .trim()
    .toLowerCase()
    .replaceAll("á", "a")
    .replaceAll("é", "e")
    .replaceAll("í", "i")
    .replaceAll("ó", "o")
    .replaceAll("ú", "u")
    .replaceAll("ñ", "n")
    .replaceAll(" ", "_");
};
