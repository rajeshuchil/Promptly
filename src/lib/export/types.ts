export type ExportFormat = "html" | "zip" | "react" | "nextjs";

export interface ExportOptions {
  format: ExportFormat;
  minify?: boolean;
  includeAssets?: boolean;
}

export interface ExportResult {
  filename: string;
  contentType: string;
  data: Buffer | string;
}
