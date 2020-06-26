class ArticleList {
	
	constructor($root, $service, $totalLabel) {
		this.$root = $root;
	    this.list = [];
	    this.$service = $service;
	    this.$totalLabel = $totalLabel;
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

	    article.onRemove(() => {
	    	var deferred = $.Deferred();
	    	self.$service.remove({
	    		'id': article.id()
	    	}).then(function(response){
		    	self.list.splice(self.list.indexOf(article), 1);
		    	self.updateItemCount();
			    $('li[data-id="'+ article.id() +'"]').remove();
			    deferred.resolve();
			},function(error) {
				deferred.reject();
	    		console.log('onRemove error: ' + error);
	    	});
	    	return deferred;
	    });
	    
	    article.onEdit(() => {
	    	var deferred = $.Deferred();
	    	self.$service.update({
    			"id": article.id(),	
    		    "picture": {
    		    	"filename": article.filename(),
    		    	"blob": article.blob()
    		    },
    		    "description": article.description()
	    	}).then(function(response) {
	    		self.refresh();
	    		deferred.resolve();
	    	},function(error) {
	    		deferred.reject();
	    		console.log('onEdit error: ' + error);
	    	});
	    	return deferred;
	    });
	}
	
	listArticles() {
		const self = this;
		self.$service.list().then((response) => {
			self.clear();
			for (var i=0;i<response.data.length;i++) {
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
			self.updateItemCount();
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
		this.list = [];
	}
	
	updateOrder() {
		var json = {
			"ids": []
		};
		$(this.$root).children('li').each(function(index){
			json.ids.push($(this).data('id'));
		});
		return this.$service.updateOrder(json);
	}	
	
	updateItemCount() {
		this.$totalLabel.text("Total items: " + this.list.length);
	}	
}