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

function isSupportedFileExtension(file,required=true) {
	var supportedExtensions = ['image/jpg','image/jpeg','image/gif','image/png'];
	var deferred = $.Deferred();
	if (file == undefined && required) {
		deferred.reject('Image is required');
	} else if (supportedExtensions.indexOf(file.type) != -1) {
        deferred.resolve(file);
    } else {
        deferred.reject('Unsopported format file.');
    }
    return deferred;
}

function isSupportedImageSize(e) {
	var deferred = $.Deferred();
	var image = new Image();
	image.src = e.target.result;
	image.onload = function () {
	  var height = this.height;
	  var width = this.width;
	  if (height >= 320 && height <= 320 
		&& width >= 320 && width <= 320) {
	     deferred.resolve(this.src);
	  } else {
		 deferred.reject('Incorrect image size.'); 
	  }
	};
	return deferred;
}