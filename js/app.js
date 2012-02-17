$(function(){
	
	var Doc = Backbone.Model.extend({});
	var Docs = Backbone.Collection.extend({
		model: Doc
	});
	var DocView = Backbone.View.extend({
		el : $('#docs'),
		events : {
			
		},
		initialize : {
			
		},
		render: function() {
			
		}
	});
	
	var Uploads = Backbone.Collection.extend({
		model: Doc
	});
	var UploadView = Backbone.View.extend({
		el: $('#uploads'),
		events: {
			
		},
		initialize: function() {
			
		},
		render: function() {
			
		}
	});

	var Tab = Backbone.Model.extend({});
	var Tabs = Backbone.Collection.extend({
		model: Tab
	});
	var TabView = Backbone.View.extend({
		el: $('#tabs'),
		template: $('#tabs-template').html(),
		events: {
			
		},
		initialize : function() {
			this.render();
		},
		render: function() {
			var html = _.template(this.template, {});
			$(this.el).html(html);
		}
	});

	var Tag = Backbone.Model.extend({});
	var Tags = Backbone.Collection.extend({
		model: Tag
	});
	var TagView = Backbone.View.extend({
		el : $('#tags'),
		events : {
			
		},
		initialize : function() {
			
		},
		render: function() {
			
		}
	});
	
	// Main application view
	window.AppView = Backbone.View.extend({
		el: $('#raindrop'),
		events: {
			"click form#search button":  "search"
		},
		initialize: function() {
			window.Tabs = new TabView;
		},
		render: function() {
			
		},
		search: function() {
			alert('w00t - backbone event!!!');
			return false;
		}
	});
	window.App = new AppView;
	
	// on initialize - should get/set - db (localStorage)
	
	// modal prompt if necessary
	
	// if local storage doesn't exist - persist as cookie on localhost?
	// or no persistence - have to authenticate and provide db every time



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
