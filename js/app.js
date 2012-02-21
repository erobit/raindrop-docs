$(function(){
	
	var Tab = Backbone.Model.extend({
		defaults: {
			
		}
	});
	var Tabs = Backbone.Collection.extend({
		model: Tab,
		url: "_view/get_tabs?group_level=1",
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
		el: $("#tabs"),
		template: $("#tabs-template").html(),
		events: {
			"click a": "tabClick"
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
			var tab = this.collection.at(index);
			$(this.el).find("li").removeClass("active").eq(index).addClass("active");
			this.render_tags(tab);
		},
		render_tags: function(tab) {
			var template = Handlebars.compile($("#tags-template").html());
			var tags = tab.get("tags");
			var html = template({ tags: tab.get("tags") });
			$("#tags").html(html);
			this.select_tag(0);
		},
		select_tag: function(index) {
			$("#tags li").eq(index).addClass("active");
			
			// docs.url = '&startkey=["tab"]&endkey=["tab",{}] || &key=["tab","tag"] - for specific tag'
			//docs.fetch() - this will automatically re-bind the docView and re-render
		},
		tabClick: function(obj) {
			var index = $(obj.srcElement.parentElement).index();
			this.select_tab(index);
		}
	});
	
	var Doc = Backbone.Model.extend({});
	var Docs = Backbone.Collection.extend({
		model: Doc
	});
	var DocView = Backbone.View.extend({
		el : $("#docs"),
		template: $("#docs-template").html(),
		events : {
		},
		initialize : function() {
			_.bindAll(this);
			this.collection.bind("reset", this.render);
		},
		render: function() {
			var template = Handlebars.compile(this.template);
			var html = template({ docs: this.collection.toJSON() });
			$(this.el).html(html);
		}
	});
	
	var Uploads = Backbone.Collection.extend({
		model: Doc
	});
	var UploadView = Backbone.View.extend({
		el: $("#uploads"),
		events: {
			
		},
		initialize: function() {
			
		},
		render: function() {
			
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
	
	var docs = new Docs();
	new DocView({ collection: docs });
	
	
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
