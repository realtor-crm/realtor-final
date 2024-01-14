import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const localRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string()
});

export class LocalRegisterDto extends createZodDto(localRegisterSchema) {}
