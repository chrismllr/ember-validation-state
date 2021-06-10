type Validators = Record<string, any[]>;

type AttributeValidation = {
  messages: string[];
  isValid: boolean;
};

type AttrsType<T> = {
  [P in keyof T]: AttributeValidation;
};

export type ValidationState<A> = {
  isValid: boolean;
  attrs: AttrsType<A>;
};

export function validate(any, any): any;

export default function validationState(
  validators: Validators | ((ctx: any) => Validators)
): PropertyDescriptor<ValidationState<typeof validators>>;
