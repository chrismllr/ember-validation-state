import { getOwner } from '@ember/application';
import macro from 'macro-decorators';
import { validate as _validate } from 'ember-validators';

/**
 * provides a macro decorator for form field validation state.
 *
 * @example
 * import validationState, { validate } from 'decorators/form-validation';
 *
 * const Validators = {
 *  username: [validate('presence', { presence: true })],
 *  password: [validate('length', { min: 6 })]
 * };
 *
 * class MyForm extends Component {
 *  @tracked username = null;
 *  @tracked password = null;
 *
 *  @validationState(Validators) validationState;
 * }
 *
 *
 * @typedef {object} ValidationState
 * @property {boolean} ValidationState.isValid
 * @property {object} ValidationState.attrs
 * @property {object} ValidationState.attrs[propertyName]
 * @property {string[]} ValidationState.attrs[propertyName].messages
 * @property {boolean} ValidationState.attrs[propertyName].isValid
 *
 * @export
 * @param {function[]} validatorFunctions - array of `validate` fns
 * @returns {ValidationState}
 */
export default function validationState(VALIDATOR_FNS) {
  return macro(function () {
    const attrState = {};

    const messages = getOwner(this).lookup('validation-state:messages');

    let formValid = true;

    for (const key in VALIDATOR_FNS) {
      attrState[key] = {
        messages: [],
        isValid: true
      };

      for (const validator of VALIDATOR_FNS[key]) {
        const [computedValid, message] = validator.apply(this, [
          this[key],
          messages
        ]);

        if (computedValid) {
          continue;
        }

        attrState[key].messages.push(message);
        attrState[key].isValid = false;
      }
    }

    for (const key in attrState) {
      formValid = attrState[key].isValid;
      if (!formValid) {
        break;
      }
    }

    return { isValid: formValid, attrs: attrState };
  });
}

/**
 * Uses `ember-validators#validate` method to provide validation for form fields.
 *
 * @example
 * const Validators = {
 *  username: [validate('presence', { presence: true })],
 *  password: [validate('length', { min: 6 })]
 * };
 *
 * @param {string} eventName - the name of the validator to use
 * @param {object} context - the options hash passed along to ember-validators
 * @returns {function<*, MessageBuilder>: [isValid: boolean, message?: string]}
 */
export function validate(eventName, context) {
  return function (value, messageSvc) {
    const validOrContext = _validate(eventName, value, context);

    if (typeof validOrContext === 'boolean') {
      return [true];
    }

    const message = messageSvc.getMessageFor(validOrContext.type, context);

    return [false, message];
  };
}
