var App = window.App = Ember.Application.create();

require('routes/*');
require('controllers/*');
require('models/*');
require('views/*');
require('helpers/*');
require('router');

$(document).ready(function() {
    $(document).foundation();
});