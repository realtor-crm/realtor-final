import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const localLoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class LocalLoginDto extends createZodDto(localLoginSchema) {}
