import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
    const [relatedPropertyName] = args.constraints as string[];
    const targetObject = args.object as Record<string, unknown>;
    const relatedValue = targetObject[relatedPropertyName];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    return args.property + ' just match ' + args.constraints[0];
  }
}
