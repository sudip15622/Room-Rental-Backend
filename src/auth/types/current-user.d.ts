import { Role } from "generated/prisma"

export type CurrentUser = {
    id: string,
    roles: Role[]
}