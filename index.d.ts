type Validators = Record<string, any[]>;

interface AttributeValidation {
  messages: string[];
  isValid: boolean;
}

type AttrsType<T> = {
  [P in keyof T]: AttributeValidation;
};

export interface ValidationState<A> {
  isValid: boolean;
  attrs: AttrsType<A>;
}

export function validate(validatorName: any, context: any, model?: any, attribute?: string): any;

export default function validationState(
  validators: Validators | ((ctx: any) => Validators)
): <T>(target: T, key: keyof T) => void;
