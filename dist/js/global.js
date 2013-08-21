(function() {

var App = window.App = Ember.Application.create();


})();

(function() {

App.IndexView = Ember.View.extend({
	templateName: 'index'
});

})();

(function() {

App.Router.map(function() {

	this.resource('articles', function() {
		this.route('show');
	});
	
});

App.IndexRoute = Ember.Route.extend({
	model: function () {
		return ['red', 'yellow', 'blue'];
	}
});

})();