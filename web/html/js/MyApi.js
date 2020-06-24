/*
 * MyApi class. 
 * Offers all methods to connect with the API
 */
class MyApi {

	constructor($url) {
		this.$baseUrl = $url;
	}
	
	add(json) {
		return $.ajax({
		    url: this.$baseUrl + '/articles',
		    type: "POST",
		    crossDomain: true,
		    dataType: 'json',
		    processData: false,
		    contentType: 'application/json; charset=UTF-8',
		    data: JSON.stringify(json)
		});
	}
	
	update(json) {
		return $.ajax({
		    url: this.$baseUrl + '/articles',
		    type: "PUT",
		    crossDomain: true,
		    dataType: 'json',
		    processData: false,
		    contentType: 'application/json; charset=UTF-8',
		    data: JSON.stringify(json)
		});
	}
	
	remove(json) {
		return $.ajax({
		    url: this.$baseUrl + '/articles',
		    type: "DELETE",
		    crossDomain: true,
		    dataType: 'json',
		    processData: false,
		    contentType: 'application/json; charset=UTF-8',
		    data: JSON.stringify(json)
		});
	}
	
	updateOrder(json) {
		return $.ajax({
		    url: this.$baseUrl + '/articles/sort',
		    type: "PUT",
		    crossDomain: true,
		    dataType: 'json',
		    processData: false,
		    contentType: 'application/json; charset=UTF-8',
		    data: JSON.stringify(json)
		});
	}
	
	list() {
		return $.ajax({
			url: this.$baseUrl + '/articles',
			type: "GET",
			dataType: "json",
			crossDomain: true
		});
	}
}
