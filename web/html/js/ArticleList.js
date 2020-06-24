class ArticleList {
	
	constructor($root, $service) {
		this.$root = $root;
	    this.list = [];
	    this.$service = $service;
	}
	
	add(article) {
		const self = this;
		return this.$service.add({
			"picture": {
		    	"filename": article.filename(),
		    	"blob": article.blob()
		    },
		    "description": article.description(),
		    "order": null
		});
	}
	
	appendArticle(article) {
		const self = this;
		this.list.push(article);
	    article.appendTo(this.$root);

	    article.onRemove((callback) => {
	    	self.$service.remove({
	    		'id': article.id()
	    	}).then(function(response){
		    	self.list.splice(self.list.indexOf(article), 1);
			    $('li[data-id="'+ article.id() +'"]').remove();
			    callback();
			},function(error) {
	    		console.log('onRemove error: ' + error);
	    	});
	    });
	    
	    article.onEdit((callback) => {
	    	self.$service.update({
    			"id": article.id(),	
    		    "picture": {
    		    	"filename": article.filename(),
    		    	"blob": article.blob()
    		    },
    		    "description": article.description()
	    	}).then(function(response) {
	    		self.refresh();
	    		callback();
	    	},function(error) {
	    		console.log('onEdit error: ' + error);
	    	});
	    });
	}
	
	listArticles() {
		const self = this;
		self.$service.list().then((response) => {
			self.clear();
			self.list = [];
			for (var i=0;i<response.data.length;i++) {
				console.log('appendArticle', i);
				self.appendArticle(
					new Article(
						response.data[i].id, 
						response.data[i].description, 
						response.data[i].picture.filename, 
						response.data[i].picture.blob, 
						response.data[i].order
					)
				);
			}
		});
	}
	
	getArticle(id) {
		for (var i=0;i<this.list.length;i++) {
			if (this.list[i].id() == id) {
				return this.list[i];
			}
		} 
		return false;
	}
	
	refresh() {
		this.$root.sortable( "refresh" );
	}
	
	clear() {
		this.$root.empty();
	}
	
	updateOrder() {
		console.log('updateOrder');
	}
	
	
}