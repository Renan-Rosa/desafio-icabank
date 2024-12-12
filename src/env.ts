import { z } from 'zod';

// Validação das variáveis de ambiente .env
export const envSchema = z.object({
  NODE_ENV: z.string(),
  MOCK_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
});

// Exporta as tipagens do env
export type Env = z.infer<typeof envSchema>;
