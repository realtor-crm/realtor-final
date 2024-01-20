import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const localLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().default(false)
});

export class LocalLoginDto extends createZodDto(localLoginSchema) {}
