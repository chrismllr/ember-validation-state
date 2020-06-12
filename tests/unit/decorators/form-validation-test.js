import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import validationState, { validate } from 'ember-validation-state';

module('Unit | Decorator | formValidation', function (hooks) {
  setupRenderingTest(hooks);

  test('returns a state object, which has a falsey `isValid` value if one key fails any of its validations', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedForm {
      email = null;

      @validationState(validations) validState;
    }

    const obj = new ValidatedForm();

    assert.equal(obj.validState.isValid, false);
  });

  test('invalid key returns a message to display', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedForm {
      email = null;

      @validationState(validations) validState;
    }

    const obj = new ValidatedForm();

    assert.equal(obj.validState.attrs.email.messages.length, 2);
    assert.equal(obj.validState.attrs.email.isValid, false);
  });

  test('isValid is true when all validations pass', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedForm {
      email = 'joel.embiid@sixers.net';

      @validationState(validations) validState;
    }

    const obj = new ValidatedForm();

    assert.equal(obj.validState.isValid, true);
    assert.equal(obj.validState.attrs.email.messages.length, 0);
    assert.equal(obj.validState.attrs.email.isValid, true);
  });
});
