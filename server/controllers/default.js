exports.install = function() {
	F.route('/', view_index);
};

function view_index(req, res) {
	var self = this;
	self.view('index');
}
