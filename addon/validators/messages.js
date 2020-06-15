import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import ValidatorsMessages from 'ember-validators/messages';
import DIProvider from '../-private/di-provider';

export default class ValidationMessages extends DIProvider {
  @service intl;

  prefix = 'errors';

  constructor() {
    super(...arguments);

    if (!this.intl) {
      warn(
        `[validation-state] ember-intl not present. Falling back to default ember-validators Message builder`,
        { id: 'validation-state.messages.no-intl' }
      );
    }
  }

  getDescription(context) {
    if (this.intl) {
      return this.intl.exists(`${this.prefix}${context.descriptionKey}`) &&
        this.intl.t(`${this.prefix}${context.descriptionKey}`);
    }

    return context.description || ValidatorsMessages.defaultDescription;
  }

  getMessageFor(type, context) {
    const { prefix } = this;
    const intlKey = context.intlKey || type;

    context.description = this.getDescription(context);

    // if ember-intl addon is not installed, call the validators method
    if (!this.intl) {
      return ValidatorsMessages.getMessageFor(...arguments);
    }

    // Otherwise, look it up in intl
    if (this.intl.exists(key)) {
      return this.intl.t(`${prefix}.${intlKey}`, context);
    }

    warn(
      `[validation-state] Internationalized string not provided for <${type}>. Falling back to ember-validators Message builder`,
      { id: 'validation-state.messages.not-defined-intl' }
    );

    return ValidatorsMessages.getMessageFor(...arguments);
  }
}
