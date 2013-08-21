App.Router.map(function() {

	this.route('login');
	this.route('logout');

	this.resource('articles', function() {
		this.route('show', {path: '/:slug'});
	});
	
});

App.Router.reopen({location: 'history'})

/* Filters */

App.GuestRoute = Ember.Route.extend({
	redirect: function() {
		if(!this.controllerFor('auth').get('isGuest')){
			this.transitionTo('index');
		}
	}
});

App.AuthRoute = Ember.Route.extend({
	redirect: function() {
		if(this.controllerFor('auth').get('isGuest')){
			this.transitionTo('index');
		}
	}
});

/* Routes */

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		this.checkLogin = this.checkLogin || this.controllerFor('auth').checkLogin();
	}
});

App.IndexRoute = Ember.Route.extend({
	model: function () {
		return ['red', 'yellow', 'blue'];
	}
});

App.ArticlesIndexRoute = App.AuthRoute.extend({
	model: function() {
		return App.Article.findAll();
	}
});

App.ArticlesShowRoute = App.AuthRoute.extend({
	model: function(params) {
		return App.Article.findBySlug(params.slug);
	},
	serialize: function(model) {
		return { slug: model.slug };
	}
});

/* Guest Routes */

App.LoginRoute = App.GuestRoute.extend({
	renderTemplate: function() {
		this.render({ controller: 'auth' });
	},
	setupController: function(controller, model) {
		this.controllerFor('auth').reset();
	},
});

/* Auth Routes */

App.LogoutRoute = App.AuthRoute.extend({
	setupController: function(controller, model) {
		this.controllerFor('auth').logout();
	}
});