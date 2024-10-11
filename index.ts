import { Client } from "whatsapp-web.js";
import {
  extractColumnsFromSheet,
  getAvailableMessages,
  getAvailableSheets,
  getDataFromSheet,
} from "./src/excel";
import { selectMessagePrompt, selectSheetPrompt } from "./src/interface";
import { replaceMessageVariables, sendMessage } from "./src/message";
import { ExtractedRowResult } from "./src/types/Excel";
import { getRequiredVariables, validateVariables } from "./src/validations";
import { getWspClient } from "./src/wsp-client";
import { confirm } from "@inquirer/prompts";

const FILENAME = "LCI.xlsx";
const MESSAGES_SHEET = "Mensajes";
const ACCOUNTS_SHEET = "Cuentas";
const EXCLUDED_SHEETS = [MESSAGES_SHEET, ACCOUNTS_SHEET];

const main = async () => {
  const wspClient = await getWspClient();
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

    // Filtrar "mensaje 03" de la lista que verá el usuario
    const availableMessagesForUser = getAvailableMessages({
      sheet: MESSAGES_SHEET,
      filename: FILENAME,
    }).filter(msg => msg.title !== 'mensaje 03');  // Ocultamos "mensaje 03"

    // Pero mantenemos "mensaje 03" internamente para poder usarlo
    const mensaje03 = getAvailableMessages({
      sheet: MESSAGES_SHEET,
      filename: FILENAME,
    }).find(msg => msg.title === 'mensaje 03');

    const originalMessage = await selectMessagePrompt(availableMessagesForUser);
    console.log("-> MENSAJE SELECCIONADO: ", originalMessage.title);

    // Verificamos si el mensaje seleccionado es "mensaje 01"
    const isMessage01 = originalMessage.title === "mensaje 01";

    const requiredVariables = getRequiredVariables(originalMessage.message);

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
    }).filter(row => row.data["telefono"] && row.data["bl_cuenta"]);

    console.log("-> Extrayendo datos de la hoja seleccionada...");
    console.log(`-> DATOS DE LA HOJA: ${data.length} registros`);
    console.log("-> Iniciando envío de mensajes... (Recuerde que entre mensajes se puede agregar una demora intencional 2-4 segundos)");

    const results: ExtractedRowResult[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const blCuenta = row.data["bl_cuenta"];
        let selectedMessage = originalMessage;  // Restauramos el mensaje original al inicio de cada iteración

        // Si el mensaje es "mensaje 01" y bl_cuenta es "SI", seleccionamos "mensaje 03"
        if (isMessage01 && blCuenta === 'SI' && mensaje03) {
          selectedMessage = mensaje03;
        }

        // Reemplazar variables en el mensaje
        const message = selectedMessage.message;
        const newMessage = replaceMessageVariables(message, row.data, isMessage01);
        const destination = String(row.data["telefono"]).trim() + "@c.us";

        await sendMessage(wspClient, {
          message: newMessage,
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

    console.log("-> Envío de mensajes finalizado\n");
    const confirmation = await confirm({
      message: "¿Desea enviar más mensajes?",
    });
    if (!confirmation) opc = 0;
  }

};

main().then(() => {
  console.log("Muchas gracias por usar el bot de Whatsapp de LCI!");
});


