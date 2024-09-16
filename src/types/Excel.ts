export type ExcelMessageOption = {
  title: string;
  message: string;
};

export type GetDataFromSheetConfig = {
  sheet: string;
  filename: string;
};

export type ExtractedRow = {
  data: Record<string, unknown>;
  rowIdx: number;
};

export type ExtractedRowResult = ExtractedRow & {
  success: boolean;
};
