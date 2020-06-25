function openModal(modal, id, blob, description) {
	if (modal == "remove-item-modal") {
		$('#id-to-remove').val(id);
	} else if (id==undefined) {
		$('#modal-title').text('Add new item');
	} else {	
		$('#modal-title').text('Edit item');
		$('#picture').val(blob);
		$('#description').val(description);
		$('#id-to-edit').val(id);
	}
	$('#' + modal).modal('show');
}



function getTotalItems() {
	return $('#sortable li').length;
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
	html+='      			<a href="javascript:openModal(\'item-modal\',\'{{id}}\');" class="btn btn-primary">Edit</a>';
	html+='      			<a href="javascript:openModal(\'remove-item-modal\',\'{{id}}\');" class="btn btn-primary">Remove</a>';
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
 * Reset Forms
 */
function resetForms() {
	
	//modal add
	$('#picture').val(null);
	$('#description').val(null);
	$('#id-to-edit').val(null);
	
	//modal delete
	$('#id-to-remove').val(null);
	
}

/*
 * Get all the articles and fill the list. 
 */
function fillList(element, callback) {
	MyApi.list().then(function(data) {
		element.empty();
		if (data !== undefined) {
			element.fadeOut(50, function() {
				data.forEach(function(article) {
					element.append(buildItem(article));
				});	
			}).fadeIn(100, function(){
				updateItemCount();
				callback();
			});
			
		}
	});
}

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
	return updateOrder(json);
}

/*
 * Remove Items
 */
function removeItem(id, callback) {
	return MyApi.remove({"id":id});
}

/*
 * Add Article
 */
function addItem(callback) {
	
	var file = $("#picture")[0].files[0];
	if (file) {
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = sendForm;
	}
	
	function sendForm(e) {
		MyApi.add({
		    "picture": {
		    	"filename": $("#picture")[0].files[0].name,
		    	"blob": e.target.result
		    },
		    "description": $('#description').val(),
		    "order": null
		}).then(callback);
	}
}

/*
 * Update Article
 */
function editItem(id, callback) {
	
	var file = $("#picture")[0].files[0];
	if (file) {
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = sendForm;
	}
	
	function sendForm(e) {
		MyApi.update({
			"id": id,	
		    "picture": {
		    	"filename": $("#picture")[0].files[0].name,
		    	"blob": e.target.result
		    },
		    "description": $('#description').val()
		}).then(callback);
	}
}


$(document).ready(function(){
	
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

	
	
	/*
	 * Button New Item 
	 */
	$('#add-item').on('click', function() {
		resetForms();
		openModal('item-modal');
	});
	
	/*
	 * Button Save Item Modal (Add/Edit)
	 */
	$('#btn-save-item').on('click', function() {
		var id = $('#id-to-edit').val();
		//is an Add request
		if (id==null || id=="" || id==undefined) {
			addItem(function(json){
				$('#sortable').append(buildItem(json));
	    		$('#item-modal').modal('hide');
	    		updateItemCount();
	    		resetForms();
			});
		} else {
		//is an Edit request
			editItem(id, function() {
				fillList($('#sortable'), function() {
					resetForms();
					$('#item-modal').modal('hide');
				});
			});	
		}
	})
	
	/*
	 * Button Remove Item Modal
	 */
	$('#btn-remove-item').on('click', function() {
		var id = $('#id-to-remove').val();
		removeItem(id, function(id) {
			$('#sortable li[data-id='+id+']').remove();
			updateItemCount();
			resetForms();
			$('#remove-item-modal').modal('hide');
		});
	});
	
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
	
	/*
	 * Populate the List with all the items from DDBB
	 */
	fillList($('#sortable'),() => {});
});