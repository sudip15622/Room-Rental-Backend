import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as PrismaUser } from 'generated/prisma';
import { CreateUserType } from './schemas/create-user.schema';
import { hash } from 'argon2';

@Injectable()
export class UserService {

    constructor (private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return await this.prisma.client.user.findUnique({
            where: {email: email}
        })
    }

    async findById (id: string) {
        return await this.prisma.client.user.findUnique({
            where: {id: id}
        })
    }
    
    async createUser(createUserInput: CreateUserType): Promise<PrismaUser> {
        const {password, ...rest} = createUserInput;
        let newUserInput: CreateUserType;
        if(password) {
            const hashedPassword = await hash(password);
            newUserInput = {
                ...rest,
                password: hashedPassword
            } as CreateUserType;
        } else {
            newUserInput = {
                ...rest
            } as CreateUserType;
        }
        return await this.prisma.client.user.create({
            data: newUserInput
        })
    }

    async updateRefreshToken (userId: string, refreshToken: string | null) {
        return await this.prisma.client.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: refreshToken
            }
        })
    }
}
