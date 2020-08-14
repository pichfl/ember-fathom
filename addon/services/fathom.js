import Service, { inject as service } from '@ember/service';
import { addListener, removeListener } from '@ember/object/events';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import config from 'ember-get-config';

let generatePath = (route) => {
  if (!route?.segments) {
    return;
  }

  return route.segments.reduce((acc, segment) => {
    if (segment.type !== 4) {
      acc += '/';
    }

    if (segment.type === 1 || segment.type === 2) {
      acc += '…';
    } else {
      acc += segment.value;
    }

    return acc;
  }, '');
};

export default class FathomService extends Service {
  @service router;

  config = config['ember-fathom'];
  fathom = undefined;
  pageViewBuffer = [];
  goalBuffer = [];

  init() {
    super.init(...arguments);

    this.injectFathom();

    addListener(this.router, 'routeDidChange', this._routeDidChange);
  }

  injectFathom() {
    assert(
      'ember-fathom needs to be configured in config/environment.js',
      !!this.config
    );

    const script = document.createElement('script');

    script.src = this.config.src || 'https://cdn.usefathom.com/script.js';
    script.setAttribute('site', this.config.site);

    if (this.config.includedDomains) {
      script.setAttribute('included-domains', this.config.includedDomains);
    }

    if (this.config.excludedDomains) {
      script.setAttribute('excluded-domains', this.config.excludedDomains);
    }

    script.addEventListener('load', () => {
      this.fathom = self['fathom'];

      this._submitGoals();
      this._submitPageViews();
    });

    document.body.appendChild(script);
  }

  destroy() {
    removeListener(this.router, 'routeDidChange', this._routeDidChange);

    super.destroy(...arguments);
  }

  trackPageview() {
    this.pageViewBuffer.push(...arguments);
    this._submitGoals();
  }

  trackGoal(code, value) {
    assert('fathom.trackGoal requires a code', !!code);

    this.goalBuffer.push({ code, value });
    this._submitPageViews();
  }

  _submitPageViews() {
    if (!this.fathom) {
      return;
    }

    while (this.pageViewBuffer.length > 0) {
      let event = this.pageViewBuffer.shift();

      if (!event) {
        return;
      }

      this.fathom.trackPageview(event);
    }
  }

  _submitGoals() {
    if (!this.fathom) {
      return;
    }

    while (this.goalBuffer.length > 0) {
      let event = this.goalBuffer.shift();

      if (!event) {
        return;
      }

      this.fathom.trackGoal(event.goal, event.value);
    }
  }

  @action
  _routeDidChange(transition) {
    this.trackPageview(this._createPageViewPayload(transition));
  }

  _createPageViewPayload(transition) {
    const { origin } = window.location;

    if (!this.config.trackDetails) {
      return { url: `${origin}${this.router.currentURL}` };
    }

    const { router, from, to } = transition;
    const toRoute = router.recognizer.names[to?.name];
    const fromRoute = router.recognizer.names[from?.name];

    const referrerPath = generatePath(fromRoute);
    const urlPath = generatePath(toRoute);
    const payload = {};

    if (referrerPath) {
      payload.referrer = `${origin}${referrerPath}`;
    }

    payload.url = `${origin}${urlPath}`;

    return payload;
  }
}
