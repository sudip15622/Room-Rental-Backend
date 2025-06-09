import { z } from 'zod';
import { Role } from '../enums/role.enum';

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required!' })
    .max(30, { message: 'Name is too long!' })
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
      message:
        'Name can only contains alphabets and single space between words!',
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required!' })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email!' }),
  roles: z
    .array(
      z.nativeEnum(Role, {
        errorMap: () => ({
          message: "Invalid role. Must be 'renter', 'owner', or 'admin'.",
        }),
      }),
    )
    .optional(),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>