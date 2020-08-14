'use strict';

module.exports = {
  name: require('./package').name,

  contentFor(type, config, content) {
    let fathomConfig = {
      basic: false,
      site: '',
      src: 'https://cdn.usefathom.com/script.js',
      includedDomains: '',
      excludedDomains: '',
      ...(config['ember-fathom'] || {}),
    };

    if (type !== 'body' || !fathomConfig.site || !fathomConfig.basic) {
      return '';
    }

    return `<script src="${fathomConfig.src}" site="${fathomConfig.site}"${
      fathomConfig.includedDomains
        ? ` included-domains="${fathomConfig.includedDomains}"`
        : ''
    }${
      fathomConfig.excludedDomains
        ? ` excluded-domains="${fathomConfig.excludedDomains}"`
        : ''
    } defer></script>}`;
  },
};
