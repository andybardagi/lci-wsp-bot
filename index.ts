import { Client } from "whatsapp-web.js";
import {
  extractColumnsFromSheet,
  getAvailableMessages,
  getAvailableSheets,
  getDataFromSheet,
} from "./src/excel";
import { selectMessagePrompt, selectSheetPrompt } from "./src/interface";
import { sendMessage } from "./src/message";
import { ExtractedRowResult } from "./src/types/Excel";
import { getRequiredVariables, validateVariables } from "./src/validations";
import { getWspClient } from "./src/wsp-client";

const FILENAME = "LCI.xlsx";
const MESSAGES_SHEET = "Mensajes";
const ACCOUNTS_SHEET = "Cuentas";
const EXCLUDED_SHEETS = [MESSAGES_SHEET, ACCOUNTS_SHEET];

const main = async () => {
  //const wspClient = await getWspClient();
  const wspClient = {} as Client;

  /**
   * Flujo:
   * 1 - Seleccionar hoja de planilla de excel (no se puede seleccionar "Mensajes" ni "Cuentas")
   * 2 - Seleccionar el mensaje desde la hoja de planilla llamada "Mensajes"
   * 3 - Validar que el mensaje tenga solo disponibles variables de la planilla seleccionada
   * 4 - Crear una nueva columna en la hoja de planilla seleccionada llamada "WSP - {fecha} - enviado"
   * 5 - Recorrer cada fila de la hoja seleccionada y enviar un mensaje a cada uno reemplazando las variables de la hoja de planilla
   * 6 - Actualizar la columna generada con el estado del mensaje enviado ✅/❌
   */

  let opc = -1;
  while (opc !== 0) {
    const availableSheets = getAvailableSheets(FILENAME, EXCLUDED_SHEETS);

    const selectedSheet = await selectSheetPrompt(availableSheets);
    console.log("-> HOJA SELECCIONADA: ", selectedSheet);

    const columns = extractColumnsFromSheet({
      sheet: selectedSheet,
      filename: FILENAME,
    });

    const columnsList = columns.map((column) => `\t- ${column}`).join("\n");
    console.log(`-> DATOS DISPONIBLES: \n${columnsList}`);

    const availableMessages = getAvailableMessages({
      sheet: MESSAGES_SHEET,
      filename: FILENAME,
    });

    const selectedMessage = await selectMessagePrompt(availableMessages);

    const requiredVariables = getRequiredVariables(selectedMessage.message);

    const validationResult = validateVariables({
      requiredVariables,
      availableVariables: columns,
    });

    if (!validationResult.success) {
      console.log(
        "-> ERROR: El mensaje elegido requiere de las siguientes variables que no están disponibles en la hoja seleccionada:"
      );
      console.log(
        validationResult.missingVariables.map((v) => `- ${v}`).join("\n")
      );
      continue;
    }

    const data = getDataFromSheet({
      sheet: selectedSheet,
      filename: FILENAME,
    });

    console.log("-> Extrayendo datos de la hoja seleccionada...");
    console.log(`-> DATOS DE LA HOJA: ${data.length} registros`);
    console.log("-> Iniciando envío de mensajes... (Recuerde que entre mensajes se puede agrega una demora intencional 2-4 segundos)");

    const results: ExtractedRowResult[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // TODO: Reemplazar variables en el mensaje
        const message = selectedMessage.message;
        const destination = "";
        await sendMessage(wspClient, {
          message,
          destination,
        });

        results.push({
          ...row,
          success: true,
          rowIdx: row.rowIdx,
        });
        console.log(`${row.rowIdx}. mensaje enviado correctamente`);
      } catch (error) {
        results.push({
          ...row,
          success: false,
          rowIdx: row.rowIdx,
        });
      }
    }

    // TODO: Actualizar columna generada con el estado del mensaje enviado ✅/❌
  }
};

main().then(() => {
  console.log("Muchas gracias por usar el bot de Whatsapp de LCI!");
});
