# `ember-validation-state`

![CI](https://github.com/chrismllr/ember-validation-state/workflows/CI/badge.svg)
[![Ember Observer Score](https://emberobserver.com/badges/ember-validation-state.svg)](https://emberobserver.com/addons/ember-validation-state)

An Octane-ready decorator which provides form-field validation state by utilizing [ember-validators](https://github.com/offirgolan/ember-validators) validators.

This addon takes heavy inspiration, and is based mostly upon, the work in [`ember-cp-validations`](https://github.com/offirgolan/ember-cp-validations), but takes the reactive decorator approach rather than the Mixin approach.


## Compatibility

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


## Installation

```
ember install ember-validation-state
```


## Usage

```js
import Component from '@glimmer/component';
import validationState, { validate } from 'ember-validation-state';

const Validators = {
  username: [validate('presence', { presence: true })],
  password: [validate('length', { min: 6 })]
};

class MyForm extends Component {
  @tracked username = null;
  @tracked password = null;

  @validationState(Validators) validationState;
}
```

### ValidationState type definition

```ts
interface AttributeValidation {
  messages: string[];
  isValid: boolean;
}

interface Attrs {
  [propertyName: string]: AttributeValidation;
}

interface ValidationState {
  isValid: boolean;
  attrs: Attrs
}
```

## Intl

By default, if ember-intl is installed, validationState will attempt to look for a message for a specific validation error in your translations file. If no key is present, it will fall back to the ember-validators message.

```yaml
# en-us.yml

errors:
  # provide intl version of of ember-validators `blank`
  blank: '{description} cannot be blank'
```

### `intlKey`
Pass `intlKey` if you would like to use a different intl key. Will be prefixed with `errors.` for the translations file lookup

```yaml
# en-us.yml

errors:
  username-empty: 'Gotta fill in username'
```

```js
import { validate } from 'ember-validation-state';

const Validators = {
  username: [validate('presence', { presence: true, intlKey: 'username-empty' })]
};
```

### `descriptionKey`
Pass `descriptionKey` if you would like to internationalize the "description" of the field. Default is "This field". Will be prefixed with `errors.` for the translations file lookup

```yaml
# en-us.yml

errors:
  usernames: 'Username'

  # message that `descriptionKey` lookup will be inserted into
  blank: '{description} cannot be blank'
```

```js
import { validate } from 'ember-validation-state';

const Validators = {
  username: [validate('presence', { presence: true, descriptionKey: 'usernames' })]
};
```


## Custom validation methods

Custom validation methods can be passed in the array for a specific key. They are passed along the Messages builder for convenience.

**Validator signature**
```ts
interface MessageBuilder {
  getMessageFor(type: string, context: object): string
}

type Validator = (value: any, messages: MessageBuilder) => [boolean, string];
```

In action:

```yaml
# en-us.yml

errors:
  password-regex: 'Password does not match required format'
```

```js
import Component from '@glimmer/component';
import validationState, { validate } from 'ember-validation-state';

function passwordRegex(value, messages) {
  return [
    /W/.test(value),
    messages.getMessageFor('password-regex')
  ];
}

const Validators = {
  username: [validate('presence', { presence: true })],
  password: [
    validate('length', { min: 6 }),
    passwordRegex
  ]
};

class MyForm extends Component {
  @tracked username = null;
  @tracked password = null;

  @validationState(Validators) validationState;
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
