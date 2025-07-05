import { z } from 'zod';
import { Role } from 'generated/prisma';

export const CreateUserSchema = z
  .object({
    name: z.string().min(2, {message: "Full name is Required!"}).regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {message: "Name must contain only letters and a single space between words!"}),
    email: z.string().min(1, {message: "Email is required!"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {message: "Invalid email address!"}),
    image: z.string().optional(),
    password: z.string().min(8, {message: "Password must be 8 character long!"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {message: "Password must contain atleast one uppercase, lowercase, number, special character!"}).optional(),
    roles: z.array(z.nativeEnum(Role)).optional(),
  })
  .strict();

export type CreateUserType = z.infer<typeof CreateUserSchema>;
