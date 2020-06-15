import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import validationState, { validate } from 'ember-validation-state';

module('Integration | Decorator | formValidation', function (hooks) {
  setupApplicationTest(hooks);

  test('returns a state object, which has a falsey `isValid` value if one key fails any of its validations', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedService extends Service {
      email = null;

      @validationState(validations) validState;
    }

    this.owner.register('service:validated', ValidatedService);
    const svc = this.owner.lookup('service:validated');

    assert.equal(svc.validState.isValid, false);
  });

  test('invalid key returns a message to display', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedService extends Service {
      email = null;

      @validationState(validations) validState;
    }

    this.owner.register('service:validated', ValidatedService);
    const svc = this.owner.lookup('service:validated');

    assert.equal(svc.validState.attrs.email.messages.length, 2);
    assert.equal(svc.validState.attrs.email.isValid, false);
  });

  test('isValid is true when all validations pass', function (assert) {
    const validations = {
      email: [
        validate('presence', { presence: true }),
        validate('format', { type: 'email' })
      ]
    };

    class ValidatedService extends Service {
      email = 'joel.embiid@sixers.net';

      @validationState(validations) validState;
    }

    this.owner.register('service:validated', ValidatedService);
    const svc = this.owner.lookup('service:validated');

    assert.equal(svc.validState.isValid, true);
    assert.equal(svc.validState.attrs.email.messages.length, 0);
    assert.equal(svc.validState.attrs.email.isValid, true);
  });

  module('intl messaging', function(intlHooks) {
    intlHooks.beforeEach(function() {
      this.setup = (validations, assert) => {
        class IntlSvc extends Service {
          exists(key) {
            return !key.includes('undefined');
          }

          t(key) {
            assert.step(`intl lookup called for ${key}`);
            return key;
          }
        }

        class ValidatedService extends Service {
          email = '';

          @validationState(validations) validState;
        }

        this.owner.register('service:intl', IntlSvc);
        this.owner.register('service:validated', ValidatedService);

        return this.owner.lookup('service:validated');
      }
    });

    test('Looks up via intl by default', function (assert) {
      const validations = {
        email: [validate('presence', { presence: true })]
      };

      const validatedObj = this.setup(validations, assert);

      validatedObj.get('validState.isValid');
      assert.verifySteps(['intl lookup called for errors.blank']);
    });

    test('Looks up different intlKey if provided', function (assert) {
      const intlKey = 'email-presence';

      const validations = {
        email: [validate('presence', { presence: true, intlKey })]
      };

      const validatedObj = this.setup(validations, assert);

      validatedObj.get('validState.isValid');
      assert.verifySteps([`intl lookup called for errors.${intlKey}`]);
    });

    test('Looks up description by descriptionKey if provided', function (assert) {
      const descriptionKey = 'email-presence';

      const validations = {
        email: [validate('presence', { presence: true, descriptionKey })]
      };

      const validatedObj = this.setup(validations, assert);

      validatedObj.get('validState.isValid');
      assert.verifySteps([
        `intl lookup called for errors.${descriptionKey}`,
        'intl lookup called for errors.blank'
      ]);
    });
  });
});
