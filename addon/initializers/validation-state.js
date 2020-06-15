import Messages from '../validators/messages';

export function initialize(application) {
  application.register('validation-state:messages', Messages);
}

export default {
  initialize
};
