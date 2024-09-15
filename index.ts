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

    // TODO: remove this
    //const selectedSheet = selectSheetPrompt(availableSheets);
    const selectedSheet = availableSheets[0];
    console.log("Hoja seleccionada: ", selectedSheet);

    const columns = extractColumnsFromSheet({
      sheet: selectedSheet,
      filename: FILENAME,
    });

    console.log(`Columnas seleccionadas: [ ${columns.join(", ")} ]`);

    const availableMessages = getAvailableMessages({
      sheet: MESSAGES_SHEET,
      filename: FILENAME,
    });

    console.log(
      `Mensajes disponibles: ${JSON.stringify(availableMessages, null, 2)}`
    );

    // const selectedMessage = selectMessagePrompt(availableMessages);
    // TODO: remove this
    const selectedMessage = availableMessages[0];

    const requiredVariables = getRequiredVariables(selectedMessage.message);

    const validationResult = validateVariables({
      requiredVariables,
      availableVariables: columns,
    });

    if (!validationResult.success) {
      // TODO: Mensaje de error
      console.log(validationResult.missingVariables);
      continue;
    }

    const data = getDataFromSheet({
      sheet: selectedSheet,
      filename: FILENAME,
    });

    console.log(
      `Datos de la hoja seleccionada: ${JSON.stringify(data, null, 2)}`
    );

    // TODO: Enviar mensaje a cada fila de la hoja seleccionada

    const results: ExtractedRowResult[] = [];

    data.forEach(async (row) => {
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
      } catch (error) {
        //console.error(error);
        results.push({
          ...row,
          success: false,
          rowIdx: row.rowIdx,
        });
      }
    });

    // TODO: Actualizar columna generada con el estado del mensaje enviado ✅/❌
  }
};

main().then(() => {
  console.log("Terminé la ejecución");
});
