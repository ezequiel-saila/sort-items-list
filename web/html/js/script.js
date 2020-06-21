$(document).ready(function(){
	function updateItemCount() {
		$('#total-items').text("Total items: " + $('#sortable li').length);
	}
	/*
	 * Item list template
	 */
	function buildItemTemplate() {
		var html = '';
		html+='<li class="item" data-id="{{id}}" data-order="{{order}}">';
		html+='  <div class="card">';
		html+='		<div class="row">';
		html+='			<div class="col-4">';
		html+='    			<img class="card-img-top" src="{{{blob}}}" alt="{{{filename}}}">';
		html+='			</div>';
		html+='			<div class="col-8">';
		html+='    			<div class="card-body">';
		html+='      			<p class="card-text">{{description}}</p>';
		html+='      			<a href="#" class="btn btn-primary">Edit</a>';
		html+='      			<a href="#" class="btn btn-primary">Remove</a>';
		html+='    			</div>';
		html+='			</div>';
		html+='		</div>';
		html+='  </div>';
		html+='</li>';
		return Handlebars.compile(html);	
	}
	
	/*
	 * Build the HTML Element with the article data
	 */
	function buildItem(article) {
		var template = buildItemTemplate();
		
		return template({
			id: article.id,
			order: article.order,
			filename: article.picture.filename,
			blob: article.picture.blob,
			description: article.description
		});
	}
	
	/*
	 * Get all the articles and fill the list. 
	 */
	function fillList(element) {
		$.ajax({
			method: "GET",
			dataType: "json",
			crossDomain: true,
			url: "http://localhost:5000/api/articles",
			success: function(response) {
				element.empty();
				if (response.data !== undefined) {
					response.data.forEach(function(article) {
						element.append(buildItem(article));
					});
					updateItemCount();
				}
			}
		});
	}

	/*
	 * Add Article
	 */
	$('.form-article').submit(function(e) {
		e.preventDefault();
		
		var file = $("#picture")[0].files[0];
		if (file) {
		    var reader = new FileReader();
		    reader.readAsDataURL(file);
		    reader.onload = sendForm;
		}
		
		function sendForm(e) {
			
			var json = {
			    "picture": {
			    	"filename": $("#picture")[0].files[0].name,
			    	"blob": e.target.result
			    },
			    "description": $('#description').val(),
			    "order": null
			}
			
			$.ajax({
			    url: 'http://localhost:5000/api/articles',
			    type: "POST",
			    crossDomain: true,
			    dataType: 'json',
			    processData: false,
			    contentType: 'application/json; charset=UTF-8',
			    data: JSON.stringify(json),
			    success: function(response) {
			    	if (response.data !== undefined) {
			    		json.id = response.data.id;
			    		$('#sortable').append(buildItem(json));
			    		$('#add-item-modal').modal('hide');
			    		updateItemCount();
					}
			    },
			    fail: function(error) {
			    	console.log('error: ', error);
			    }
			});
			
		}
		
	});

	/*
	 * Update Article
	 */
	//$('.form-article').submit
	
	/*
	 * Sort Items
	 */
	function sortItems(callback) {
		
		var json = {
			"ids": []
		};
		
		$('#sortable li').each(function(index){
			json.ids.push($(this).data('id'));
		});
		
		$.ajax({
		    url: 'http://localhost:5000/api/articles/sort',
		    type: "PUT",
		    crossDomain: true,
		    dataType: 'json',
		    processData: false,
		    contentType: 'application/json; charset=UTF-8',
		    data: JSON.stringify(json),
		    success: function(response) {
		    	if (response.data !== undefined) {
		    		callback();
				}
		    },
		    fail: function(error) {
		    	console.log('error: ', error);
		    }
		});
		
	}
	
	
	
	/*
	 * Init Sortable
	 */
	position_updated = false;
	
	$( "#sortable" ).sortable({
	 	connectWith: "#sortable",
		update: function(event, ui) {
      		position_updated = !ui.sender; //if no sender, set sortWithin flag to true
      		console.log('update');
		},
      	stop: function(event, ui) {
			if (position_updated) {
				sortItems(function() {
					position_updated = false;	
				});
			}
			console.log('stop');
		},
		receive: function(event, ui) {
			//code
			console.log('receive');
		}
	}).disableSelection();

	fillList($('#sortable'));
	
	
	$('#btn-add-item').on('click', function() {
		$('.form-article').submit();
	})
	
	/*
	 * Hello world check API
	 */
	$.ajax({
	  method: "GET",
	  dataType: "json",
	  crossDomain: true,
	  url: "http://localhost:5000/api/hello",
	  success: function(response) {
		  console.log(response);
	  }
	});
	
	
});