/*
 * Read a File object and return a blob
 * 
 * @var File file
 * @return Promise
 */
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