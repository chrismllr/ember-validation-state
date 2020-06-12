# `ember-validation-state`

Provides an Octane-ready decorator which can be used in conjunction with ember-validation validators, to provide form field validation state.

This addon takes heavy inspiration, and is based mostly upon, the work in [`ember-cp-validations`](https://github.com/offirgolan/ember-cp-validations), but with a more straightforward approach, and smaller API.


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

## Contributing


See the [Contributing](CONTRIBUTING.md) guide for details.


## License


This project is licensed under the [MIT License](LICENSE.md).
