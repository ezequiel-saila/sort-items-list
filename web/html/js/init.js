(function ($) {
	
	const api = new MyApi('http://localhost:5000/api');
	const articleList = new ArticleList($('#sortable'), api, $('#total-items'));
    
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
		$('#error-message-picture').text('');
		$('#error-message-description').text('');
		$('#btn-add-item').on('click', () => {
			
			if ($('#description').val() == '') {
				$('#error-message-description').text('Description is required');
				return false;
			}
				
			isSupportedFileExtension($("#picture")[0].files[0])
			.then(readFile)
			.then(isSupportedImageSize)
			.then((blob) => {
				articleList.add(
					new Article(null,$('#description').val(),$("#picture")[0].files[0].name,blob,null)
				).then((response) => {
					articleList.listArticles();
					$('#item-add-modal').modal('hide');
				}).fail((error) => {
					//api level error
					console.log('api', error);
				});
			}).fail((error) => {
				//show error
				$('#error-message-picture').text(error);
				console.log('fail', error);
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
		$('#error-message-picture-edit').text('');
		$('#error-message-description-edit').text('');
		$('#description-edit').val(article.description());
		$('#btn-edit-item').unbind('click');
		$('#btn-edit-item').on('click', () => {
			
			if ($('#description-edit').val() == '') {
				$('#error-message-description-edit').text('Description is required');
				return false;
			}
			
			if ($("#picture-edit")[0].files[0] === undefined) {
				article.$description = $('#description-edit').val();
				article.save().then((response) => {
					articleList.listArticles();
					$('#item-edit-modal').modal('hide')
				});			
			} else {
				isSupportedFileExtension($("#picture-edit")[0].files[0])
				.then(readFile)
				.then(isSupportedImageSize)
				.then((blob) => {
					article.$description = $('#description-edit').val();
					article.$filename = $("#picture-edit")[0].files[0].name || article.filename();
					article.$blob = blob || article.blob(); 
					article.save().then((response) => {
						articleList.listArticles();
						$('#item-edit-modal').modal('hide');
					}).fail((error) => {
						//api level error
						console.log('api', error);
					});	
				}).fail((error) => {
					//show error
					$('#error-message-picture-edit').text(error);
					console.log('fail', error);
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