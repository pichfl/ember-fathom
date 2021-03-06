import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('detail', { path: ':detail_id' }, function () {
    this.route('subdetail', { path: '1_/:subdetail_id' });
  });
});
