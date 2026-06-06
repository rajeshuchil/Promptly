export type DeviceMode = "desktop" | "tablet" | "mobile";

export type PreviewStatus = "idle" | "loading" | "success" | "error";

export interface PreviewProject {
  id: string;
  name: string;
  prompt: string;
  generatedHtml: string | null;
  createdAt: Date;
}
