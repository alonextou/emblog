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