import { Module } from '@nestjs/common';
import { CustomDateScalar } from '../scalars/date.scalar';

@Module({
  providers: [
    CustomDateScalar,
  ],
  exports: [CustomDateScalar],
})
export class CommonModule {}
