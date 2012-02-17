$(function(){
	
	// Main application view
	window.AppView = Backbone.View.extend({
		el: $('#raindrop'),
		events: {
			"click form#search button":  "search"
		},
		initialize: function() {
			
		},
		render: function() {
			
		},
		search: function() {
			alert('w00t - backbone event!!!');
		}
	});
	window.App = new AppView;
	
	// on initialize - should get/set - db (localStorage)
	
	// modal prompt if necessary
	
	// if local storage doesn't exist - persist as cookie on localhost?
	// or no persistence - have to authenticate and provide db every time

	var Doc = Backbone.Model.extend({});
	var Docs = Backbone.Collection.extend({});

	var Tab = Backbone.Model.extend({});
	var Tabs = Backbone.Collection.extend({});

	var Tag = Backbone.Model.extend({});
	var Tags = Backbone.Collection.extend({});

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
