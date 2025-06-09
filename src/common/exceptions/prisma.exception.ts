import { HttpException, HttpStatus } from "@nestjs/common";
import { Prisma } from "generated/prisma";


export class PrismaException extends HttpException {
  constructor(private readonly error: Prisma.PrismaClientKnownRequestError) {
    super(
      {
        message: "Something went wrong!",
        errors: error
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
