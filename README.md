# ember-fathom

Add [Fathom website analytics](https://usefathom.com/ref/ZX9J8J) to your
Ember.js project. While Fathom provides tracking for SPA projects out of the
box, it doesn't know about your Ember url structures and will track dynamic url
segments as well, which will expose object ids as well as clutter your tracking
database.

This addon does the setup for you and provides an easy way to add Fathom to your
Ember routing structure.

## Compatibility

- Ember.js v3.12 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-fathom
```

## Usage

To configure this addon, add settings to your `config/environment.js`.

```js
module.exports = function (/* environment, appConfig */) {
  let ENV = {
    'ember-fathom': {
      // Fathom will be disabled if no siteId was provided - You can use this to enable Fathom in production only
      site: 'YOUR_SITE_ID',
      // optional: src provided when using the custom subdomain
      src: 'https://custom.subdomain.com/script.js',
      // set basic to true to enable the default Fathom SPA tracking
      basic: false,
      // set to true to track dynamic segments. if false, dynamic segments will be replaced by "…"
      trackDetails: false,
    },
  };

  return ENV;
};
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
