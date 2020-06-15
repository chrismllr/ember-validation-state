import { inject as service } from '@ember/service';
import { action } from '@ember/object';
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

  @action getDescription(context) {
    const { prefix, intl } = this;
    const descKey = `${prefix}.${context.descriptionKey}`;

    if (intl && intl.exists(descKey)) {
      return intl.t(descKey);
    }

    return context.description || ValidatorsMessages.defaultDescription;
  }

  @action getMessageFor(type, context) {
    const { prefix, intl, getDescription } = this;
    const messageKey = context.intlKey || type;
    const prefixedMessageKey = `${prefix}.${messageKey}`;

    const ctx = {
      ...context,
      description: getDescription(context)
    };

    // if ember-intl addon is not installed, call the validators method
    if (!intl) {
      return ValidatorsMessages.getMessageFor(type, ctx);
    }

    // Otherwise, look it up in intl
    if (intl.exists(prefixedMessageKey)) {
      return intl.t(prefixedMessageKey, ctx);
    }

    warn(
      `[validation-state] Internationalized string not provided for <${type}>. Falling back to ember-validators Message builder`,
      { id: 'validation-state.messages.not-defined-intl' }
    );

    // Fall back to root getMessageFor if user has not defined an intl key for the current type
    return ValidatorsMessages.getMessageFor(type, ctx);
  }
}
