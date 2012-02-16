$(document).ready(function(){
	
	
		
	var Doc = Backbone.Model.extend({
	  defaults: {
			"created": new Date().valueOf()		
	  }
	});
	
	var DocList = Backbone.Collection.extend({
		model: Doc
	});
	
	
	window.Docs = new DocList().add(new Doc());
	

	
	function uploadFiles(e) {
		$.each( e.target.files, function(index, file) {
			var fileReader = new FileReader();
			fileReader.onload = (function(file) {
				return function(e) {
					$('#list').append('<div class="dataurl"><strong>' + file.fileName + '</strong>' + e.target.result + '</div>') 
					// this sucker should really be modal
					// the goal is to add a list of uploaded documents and fill out the meta data for each
					// then to save the documents along with the file data as an attachment to the document!
				}; 
			})(file);
	   	fileReader.readAsDataURL(file);
	  });
  }

  $('#files').bind('change', uploadFiles);
});
