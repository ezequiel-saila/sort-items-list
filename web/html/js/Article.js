class Article {
	
	constructor($id, $description, $filename, $blob, $order) {
		this.$id = $id;
		this.$description = $description;
		this.$filename = $filename;
		this.$blob = $blob;
		this.$order = $order;
		this._onEdit = () => {};
		this._onRemove = () => {};
	}
	
	id() {
		return this.$id;
	}
  
	description() {
		return this.$description;
	}
	
	filename() {
		return this.$filename;
	}
	
	blob() {
		return this.$blob;
	}
	
	order() {
		return this.$order;
	}
	
	appendTo($parent) {
		$parent.append(this.asJquery());
	}
	
	asJquery() {
		const $el = $(`
			<li class="item" data-id="${this.id()}">
				<div class="card">
					<div class="row">
						<div class="col-3">
							<img class="card-img-top" src="${this.blob()}" alt="${this.filename()}">
						</div>
						<div class="col">
							<div class="card-body">
								<p class="card-text">${this.description()}</p>
								<a href="#" class="btn btn-outline-success btn-sm btn-edit" data-id="${this.id()}" data-target="#item-edit-modal" data-toggle="modal">Edit</a>
								<a href="#" class="btn btn-outline-danger btn-sm btn-remove" data-id="${this.id()}" data-target="#item-remove-modal" data-toggle="modal">Remove</a>
							</div>
						</div>
					</div>
				</div>
			</li>`); 		
		return $el;
	}
	
	onEdit(fn) {
		this._onEdit = fn;
	}
	
	save(callback) {
		return this._onEdit(callback);
	}
	
	remove(callback) {
		return this._onRemove(callback);
	}
	
	onRemove(fn) {
		this._onRemove = fn;
	}
	
}