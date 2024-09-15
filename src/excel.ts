import {
  ExcelMessageOption,
  ExtractedRow,
  GetDataFromSheetConfig,
} from "./types/Excel";
import xlsx from "node-xlsx";
import { validateStringEquals } from "./validations";

/**
 * Función que devuelve una lista de hojas de la planilla de excel con el nombre de la hoja
 * @param fileName Nombre del archivo de la planilla de excel
 * @param exceptions Hojas a excluir de la lista de hojas disponibles
 */
export const getAvailableSheets = (
  fileName: string,
  exceptions: string[] = []
): string[] => {
  const workSheetsFromFile = xlsx.parse(`${__dirname}/${fileName}`);
  const availableSheets = workSheetsFromFile.map((sheet) => sheet.name);
  const filteredSheets = availableSheets.filter(
    (s) => !exceptions.some((e) => validateStringEquals(s, e))
  );
  return filteredSheets;
};

/**
 * Función que devuelve una lista de mensajes de la hoja de planilla de excel
 * @param data Datos necesarios para obtener los mensajes de la hoja de planilla
 * @returns Lista de mensajes de la hoja de planilla con nombre y mensaje
 * @example { title: "Mensaje de bienvenida", message: "Hola, {{nombre_completo}} ¿cómo estás?. Bienvenido!" }
 *
 */
export const getAvailableMessages = (
  data: GetDataFromSheetConfig
): ExcelMessageOption[] => {
  const { sheet, filename } = data;
  const workSheetsFromFile = xlsx.parse(`${__dirname}/${filename}`);
  const sheetData = workSheetsFromFile.find((s) => s.name === sheet);
  if (!sheetData) {
    throw new Error("No se encontró la hoja de planilla");
  }
  return sheetData.data
    .filter((row) => Boolean(row))
    .map((row, index) => ({
      title: String(row[0]),
      message: String(row[1]),
      rowIdx: index,
    }))
    .filter((row) => Boolean(row.title) && Boolean(row.message))
    .slice(1);
};

/**
 * Función que devuelve una lista de columnas de la hoja de planilla de excel
 * @param data Datos necesarios para extraer las columnas de la hoja de planilla
 * @returns Lista de columnas de la hoja de planilla
 *
 */
export const extractColumnsFromSheet = (
  data: GetDataFromSheetConfig
): string[] => {
  const { sheet, filename } = data;
  const workSheetsFromFile = xlsx.parse(`${__dirname}/${filename}`);
  const sheetData = workSheetsFromFile.find((s) => s.name === sheet);
  if (!sheetData) {
    throw new Error("No se encontró la hoja de planilla");
  }
  return sheetData.data[0]
    .filter((column) => Boolean(column))
    .map((c) => String(c));
};

/**
 *
 * @param data Datos necesarios para obtener los datos de la hoja de planilla
 * @returns Lista de objetos con las columnas de la hoja de planilla
 */
export const getDataFromSheet = (
  data: GetDataFromSheetConfig
): ExtractedRow[] => {
  const { sheet, filename } = data;

  const workSheetsFromFile = xlsx.parse(`${__dirname}/${filename}`);
  const sheetData = workSheetsFromFile.find((s) => s.name === sheet);
  if (!sheetData) {
    throw new Error("No se encontró la hoja de planilla");
  }

  const [headers, ...rows] = sheetData.data;

  return rows.map(
    (row, index) =>
      ({
        data: row
          .filter((column) => Boolean(column))
          .reduce((acc, curr, i) => {
            acc[headers[i]] = String(curr);
            return acc;
          }, {} as Record<string, unknown>),
        rowIdx: index,
      } satisfies ExtractedRow)
  );
};
