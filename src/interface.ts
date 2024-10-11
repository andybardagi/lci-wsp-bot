import { ExcelMessageOption } from "./types/Excel";
import { select } from "@inquirer/prompts";

/**
 * Función que permite al usuario seleccionar una hoja de la planilla de excel de las listadas como disponibles
 * @param sheets Lista de hojas de la planilla de excel que el usuario puede seleccionar
 */
export const selectSheetPrompt = async (sheets: string[]): Promise<string> => {
  let selection = "";

  while (selection === "" || !selection) {
    selection = await select({
      message: "Seleccione una hoja de la planilla de Excel:",
      choices: sheets.map((sheet, index) => ({
        name: `${index + 1}. ${sheet}`,
        value: sheet,
      })),
    });

    if (selection === "" || !selection) {
      console.log("Selección inválida. Por favor, inténtelo de nuevo.");
    }
  }

  return selection;
};

/**
 *
 * @param messages Lista de mensajes de la hoja de planilla de excel que el usuario puede seleccionar
 * @returns Mensaje seleccionado por el usuario
 */
export const selectMessagePrompt = async (
  messages: ExcelMessageOption[]
): Promise<ExcelMessageOption> => {
  let selection: ExcelMessageOption | null = null;

  while (!selection) {
    selection = await select({
      message: "Seleccione un mensaje de la hoja de planilla de Excel:",
      choices: messages.map((message, index) => ({
        name: `${index + 1}. ${message.title}`,
        value: message,
      })),

    });

    if (!selection) {
      console.log("Selección inválida. Por favor, inténtelo de nuevo.");
    }
   
  }

  return selection;
};
