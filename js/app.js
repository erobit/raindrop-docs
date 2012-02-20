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

	var Tab = Backbone.Model.extend({
		defaults: {
		}
	});
	var Tabs = Backbone.Collection.extend({
		model: Tab,
		url: "http://raindrop.iriscouch.com/raindrop/_design/raindrop-docs/_view/get_tabs?group_level=1",
		parse:function(tabs){
			var result = [];
			tabs.rows.forEach(function(tab, i){
				var tags = [];
				tab.value.sort().forEach(function(tag){
					tags.push({ title: tag });
				});
				result.push({ title: tab.key, tags: tags });
			});
			return result;
		}
	});
	var TabView = Backbone.View.extend({
		el: $('#tabs'),
		template: $('#tabs-template').html(),
		events: {
			
		},
		initialize : function() {
			_.bindAll(this);
			this.collection.bind("reset", this.render);
		},
		render: function() {
			var template = Handlebars.compile(this.template);
			var html = template({ tabs: this.collection.toJSON() });
			$(this.el).html(html);
			this.select_tab(0);
		},
		select_tab: function(index) {
			// set the proper tab to active
			$(this.el).find('li').eq(index).addClass('active');
		},
		render_tags: function(tags) {
			var template = Handlebars.compile($('#tags-template'));
			var html = template({ tags: tags });
			$('#tags').html(html);
		}
	});

/*
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
*/
	
	
	// Setup tabs & rendering
	var tabs = new Tabs();
	new TabView({ collection: tabs });
	tabs.fetch();

	
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
