import { z } from "zod";

export const ExportRequestSchema = z.object({
  format: z.enum(["html", "zip", "react", "nextjs"]),
});
