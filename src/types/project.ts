import { z } from "zod";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubLink: string;
  video?: string;
  demo?: string;
}

export const ProjectDemoSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  githubLink: z.string().optional(),
  video: z.string().optional(),
  demo: z.string().optional(),
});

export type ProjectDemoMetadata = z.infer<typeof ProjectDemoSchema>;

