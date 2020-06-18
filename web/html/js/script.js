$(document).ready(function(){
	
	$.ajax({
	  method: "GET",
	  dataType: "json",
	  crossDomain: true,
	  url: "http://localhost:5000/api/v1/hello",
	  success: function(response) {
		  console.log(response);
	  }
	});
	
});