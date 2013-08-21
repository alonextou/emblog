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