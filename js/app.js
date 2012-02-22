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
		events: {
			"click a": "tabClick"
		},
		initialize : function() {
			// compile handlebar templates on init
			this.template = Handlebars.compile($("#tabs-template").html());
			this.tags_template = Handlebars.compile($("#tags-template").html());
			// underscore bindAll method
			_.bindAll(this);
			// listen for a change in the collection to re-render the view
			this.collection.bind("reset", this.render);
		},
		render: function() {
			var html = this.template({ tabs: this.collection.toJSON() });
			$(this.el).html(html);
			this.select_tab(0);
		},
		select_tab: function(index) {
			var tab = this.collection.at(index);
			$(this.el).find("li").removeClass("active").eq(index).addClass("active");
			this.render_tags(tab);
		},
		tabClick: function(obj) {
			var index = $(obj.srcElement.parentElement).index();
			this.select_tab(index);
		},
		/* hack alert - tags should really be nested backbone.js collection */
		render_tags: function(tab) {
			var tags = tab.get("tags");
			var html = this.tags_template({ tags: tab.get("tags") });
			$("#tags").html(html);
			var self = this;
			$("#tags a").click(function() { 
				self.select_tag(tab, $(this).parent().index());
			});
			this.select_tag(tab, 0);
		},
		select_tag: function(tab, index) {
			var li = $("#tags li").removeClass('active').eq(index);
			li.addClass("active");
			var tab_title = tab.get('title');
			var tag_title = li.find('a').text();
			docs.url = '_view/get_docs?key=["' + tab_title + '","' + tag_title + '"]'; //	?startkey=["' + tab_title + '"]&endkey=["' + tab_title + '",{}]'; // || &key=["tab","tag"] - for specific tag'
			docs.fetch();
		}
	});
	
	var Doc = Backbone.Model.extend({});
	var Docs = Backbone.Collection.extend({
		model: Doc,
		parse:function(docs){
			var result = [];
			docs.rows.forEach(function(doc, i){
				result.push(doc.value);
			});
			return result;
		}
	});
	var DocView = Backbone.View.extend({
		el : $("#docs"),
		events : {
		},
		initialize : function() {
			// compile handlebars template on init
			this.template = Handlebars.compile($("#docs-template").html());
			_.bindAll(this);
			this.collection.bind("reset", this.render);
		},
		render: function() {
			$(this.el).hide();
			var html = this.template({ docs: this.collection.toJSON() });
			$(this.el)
				.html(html)
				.fadeIn()
				.find('a.pop').popover();
		}
	});
	
	var Uploads = Backbone.Collection.extend({
		model: Doc
	});
	var UploadView = Backbone.View.extend({
		el: $("#uploads"),
		events: {
			"click .btn-upload": "toggleUpload"
		},
		initialize: function() {
			this.template = Handlebars.compile($("#uploads-template").html());
		},
		toggleUpload: function() {
			$('#form').toggle();
		},
		render: function() {
			var html = this.template({ docs: this.collection.toJSON() });
			$(this.el).html(html);
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
	
	var uploads = new Uploads();
	new UploadView({ collection: uploads });
	
	
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
