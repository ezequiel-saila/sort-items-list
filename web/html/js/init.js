(function ($) {
	
	const api = new MyApi('http://localhost:5000/api');
	const articleList = new ArticleList($('#sortable'), api);
    
	/*
	 * Flag to know if an item change its position 
	 * on a drag&drop event.
	 */
	position_updated = false;
	/*
	 * Init Sortable
	 */
	$("#sortable").sortable({
	 	connectWith: "#sortable",
		update: function(event, ui) {
      		position_updated = !ui.sender;
		},
      	stop: function(event, ui) {
			if (position_updated) {
				articleList.updateOrder().then((response) => {
					articleList.listArticles();
					position_updated = false;	
				});
			}
		}
	}).disableSelection();
	
	/*
	 * Modal Add Item
	 */
	$('#item-add-modal').on('show.bs.modal', (event) => {
		$('#picture').val(null);
		$('#description').val('');
		$('#btn-add-item').unbind('click');
		
		$('#btn-add-item').on('click', () => {
			readFile($("#picture")[0].files[0]).then((e) => {
				return articleList.add(
					new Article(null,$('#description').val(),$("#picture")[0].files[0].name,e.target.result,null)
				)
			}).then((response) => {
				articleList.listArticles();
				$('#item-add-modal').modal('hide');
			});	  
		});
	});
	
	/*
	 * Modal Edit Item
	 */
	$('#item-edit-modal').on('show.bs.modal', (event) => {
		var button = $(event.relatedTarget);
		var id = button.data('id');
		article = articleList.getArticle(id);
		$('#description-edit').text(article.description());
		$('#btn-edit-item').unbind('click');
		$('#btn-edit-item').on('click', () => {
			if ($("#picture-edit")[0].files[0] === undefined) {
				article.$description = $('#description-edit').val();
				article.save().then((response) => {
					articleList.listArticles();
					$('#item-edit-modal').modal('hide')
				});			
			} else {
				readFile($("#picture-edit")[0].files[0]).then((e) => {
					article.$description = $('#description-edit').val();
					article.$filename = $("#picture-edit")[0].files[0].name || article.filename();
					article.$blob = e.target.result || article.blob(); 
					article.save().then((response) => {
						articleList.listArticles();
						$('#item-edit-modal').modal('hide');
					});	
				});	
			}	
		 });
	});
	 
	/*
	 * Modal Delete
	 */
	$('#item-remove-modal').on('show.bs.modal', (event) => {
		var button = $(event.relatedTarget);
		var id = button.data('id');
		$('#btn-remove-item').on('click', () => {
			var article = articleList.getArticle(id);
			article.remove().then(() => {
				$('#btn-remove-item').unbind('click');
				$('#item-remove-modal').modal('hide');
			});
		});
	});
	
	/*
	 * Get all items from DDBB and show it on web.
	 */
	articleList.listArticles();
			
}(jQuery));