import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (
      typeof value === 'object' &&
      value !== null &&
      this.isEmpty(value as Record<string, unknown>)
    )
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToClass(metatype, value as object);
    const errors = await validate(object);

    if (errors.length > 0)
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );

    return object;
  }

  private toValidate(metatype: unknown): metatype is ClassConstructor<object> {
    const types: unknown[] = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  private formatErrors(errors: ValidationError[]): string {
    return errors
      .map(err => {
        if (err.constraints)
          for (const property in err.constraints)
            return err.constraints[property];

        return '';
      })
      .filter(message => message !== '')
      .join(', ');
  }

  private isEmpty(value: Record<string, unknown>): boolean {
    if (Object.keys(value).length > 0) return false;

    return true;
  }
}
