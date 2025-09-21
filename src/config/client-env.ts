import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SF_PROCESS_INFORM_MESSAGES: z.boolean().default(false),
  NEXT_PUBLIC_APP_TITLE: z.string().min(1).default("AI Chat Assistant"),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1).default("Your intelligent AI assistant powered by Agentforce"),
  NEXT_PUBLIC_APP_INTRO_MESSAGE: z.string().min(1).default("Hello! I'm your AI assistant. How can I help you today?"),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

function validateClientEnv(): ClientEnv {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SF_PROCESS_INFORM_MESSAGES: process.env.NEXT_PUBLIC_SF_PROCESS_INFORM_MESSAGES,
      NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
      NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      NEXT_PUBLIC_APP_INTRO_MESSAGE: process.env.NEXT_PUBLIC_APP_INTRO_MESSAGE,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ");
      throw new Error(`❌ Invalid client environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Re-export the client environment variables
export const clientEnv = validateClientEnv(); 