import Messages from '../messages';

export function initialize(application) {
  application.register('validation-state:messages', Messages);
}

export default {
  initialize
};
