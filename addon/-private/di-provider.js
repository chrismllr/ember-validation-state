// Inspiration: https://github.com/NullVoxPopuli/ember-contextual-services/blob/master/addon/contextual-service.ts

// To integrate with Ember's D.I. system, this is all that's needed.
// This is provided as a convience class for creating injectable classes
export default class DIProvider {
  static create(injections) {
    return new this(injections);
  }

  constructor(injections) {
    Object.assign(this, injections);
  }
}
