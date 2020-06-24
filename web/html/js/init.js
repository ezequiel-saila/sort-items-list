(function ($) {
	
	const api = new MyApi('http://localhost:5000/api');
	const articleList = new ArticleList($('#sortable'), api);
    
	/*
	 * Init Sortable
	 */
	position_updated = false;
	
	$("#sortable").sortable({
	 	connectWith: "#sortable",
		update: function(event, ui) {
      		position_updated = !ui.sender; //if no sender, set sortWithin flag to true
		},
      	stop: function(event, ui) {
			if (position_updated) {
				sortItems(function() {
					position_updated = false;	
				});
			}
		}
	}).disableSelection();
	
	function readFile(file) {
		var deferred = $.Deferred();
		if (file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = deferred.resolve;
		} else {
			deferred.reject();
		}
		return deferred;
	}
	
	/*
	 * Modal Add Item
	 */
	$('#item-add-modal').on('show.bs.modal', (event) => {
		$('#btn-add-item').on('click', () => {
			readFile($("#picture")[0].files[0])
			.then((e) => {
				return articleList.add(
					new Article(
						null, 
						$('#description').val(), 
						$("#picture")[0].files[0].name, 
						e.target.result,
						null
					)
				)
			}).then((response) => {
				articleList.listArticles();
				$('#picture').val(null);
				$('#description').val('');
				$('#btn-remove-item').unbind('click');
				$('#item-add-modal').modal('hide');
			});	  
		});
//		} else {
//			$('.modal-title').text('Edit Article');
//			var id = button.data('id');
//			article = articleList.getArticle(id);
//			$('#description').val(article.description());
//			$('#btn-save-item').on('click', () => {
//				console.log('save edit');
//				$(this).detach();
//				readFile($("#picture")[0].files[0])
//				.then((e) => {
//					article.description = $('#description').val();
//					article.filename = $("#picture")[0].files[0].name;
//					article.blob = e.target.result; 
//					return article.save();
//				}).then((response) => {
//					modal.modal('hide')
//				});			
//			  });
//			  console.log('edit'); 
//		  }
		  
	});
	 
	
	/*
	 * Modal Delete
	 */
	$('#item-remove-modal').on('show.bs.modal', (event) => {
		var button = $(event.relatedTarget);
		var id = button.data('id');
		$('#btn-remove-item').on('click', () => {
			var article = articleList.getArticle(id);
			article.remove(() => {
				$('#btn-remove-item').unbind('click');
				$('#item-remove-modal').modal('hide');
			});
		});
	});
	
	articleList.listArticles();
			
}(jQuery));