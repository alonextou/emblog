(function() {

var App = window.App = Ember.Application.create();


})();

(function() {

App.ApplicationController = Ember.Controller.extend({
	needs: ['auth']
});

})();

(function() {

App.AuthController = Ember.Controller.extend({
	observeIsGuest: function() {
		console.log('isGuest changed: ' + this.isGuest);
	}.observes('isGuest'),
	isAdmin: false,
	reset: function(){
		this.setProperties({
			username: "",
			password: ""
		});
	},
	login: function() {
		var self = this;
		var response = $.Deferred();
		$.ajax({
			url: '/users/login',
			type: 'POST',
			//contentType: 'application/json',
			data: {
				username: this.get('username'),
				password: this.get('password')
			}
		}).done(function(data) {
			self.set('isGuest', false);
			self.transitionToRoute('index');
			response.resolve();
		}).fail(function(xhr, status, error) {
			console.log(xhr.responseText);
			response.reject();
		});
	},
	logout: function() {
		var self = this;
		var response = $.Deferred();
		$.ajax({
			url: '/users/logout',
		}).done(function(data) {
			self.set('isGuest', true);
			self.transitionToRoute('index');
			response.resolve();
		}).fail(function(xhr, status, error) {
			console.log(xhr.responseText);
			response.reject();
		});
	},
	checkLogin: function() {
		var self = this;
		var response = $.Deferred();
		$.ajax({
			url: '/users/me',
			type: 'GET'
			//contentType: 'application/json',
		}).done(function(data) {
			if (typeof data === 'undefined') {
				self.set('isGuest', true);
			} else {
				self.set('isGuest', false);
			}
			console.log('done checking');
			response.resolve(data);
		}).fail(function(xhr, status, error) {
			console.log(xhr.responseText);
			response.reject();
		});
		return response.promise();
	}
});

})();

(function() {

App.LoginController = Ember.Controller.extend({
	needs: ['auth']
});

})();

(function() {

App.Article = Ember.Object.extend();

App.Article.reopenClass({

	findAll: function() {
		var response = $.Deferred();
		var articles = [];

		$.getJSON('/articles').done(function(data) {
			$.each(data, function(key, article){
				//console.log(article);
				articles.addObject(App.Article.create(article));
			});
			response.resolve(articles);
		}).fail(function(xhr, status, error) {
			console.log(xhr.responseText);
			response.reject();
		});

		//console.log(articles);
		return response.promise();

		/*
		var articles = [];
		var data = [
			{title: 'First', content: 'Content here...'},
			{title: 'Second', content: 'More Content here...'}
		];
		$.each(data, function(){
			articles.addObject(App.Article.create(this));
		})
		return articles;
		*/
	},
	findBySlug: function(slug) {

		var response = $.Deferred();
		var article;

		$.ajax({
			url: '/articles',
			//type: "GET",
			//contentType: "application/json",
			data: {slug: slug}
		}).done(function(data) {
			var article = data[0];
			//console.log(article);
			response.resolve(article);
		}).fail(function(xhr, status, error) {
			console.log(xhr.responseText);
			response.reject();
		});

		return response.promise();
	}

});

})();

(function() {

App.IndexView = Ember.View.extend({
	templateName: 'index'
});

})();

(function() {

Ember.Handlebars.registerHelper('auth', function(options) {
	/*
	var response = $.Deferred();
	$.ajax({
		url: '/users/me',
		type: 'GET'
		//contentType: 'application/json',
	}).done(function(data) {
		if(typeof data !== 'undefined') {
			console.log('auth');
			response.resolve();
		} else {
			response.reject();
			console.log('not auth');
		}
	}).fail(function(xhr, status, error) {
		console.log(xhr.responseText);
		response.reject();
	});
	
	var test = this.controllerFor('auth').isLoggedIn();
	console.log(test);
	if( this.controllerFor('auth').isLoggedIn() ) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
	*/
});

})();

(function() {

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

})();

(function() {

$(document).ready(function() {
    $(document).foundation();
});

})();