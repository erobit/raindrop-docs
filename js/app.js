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
		el_view: $("#upload-doc-list"),
		events: {
			"click .btn-upload": "toggleUpload"
		},
		initialize: function() {
			this.template = Handlebars.compile($("#upload-doc-template").html());
			_.bindAll(this);
			this.collection.bind("add", this.render);
			// not sure how to use event delegates above to bind to id based selectors
			$('#files').bind('change', this.addDoc);
		},
		toggleUpload: function() {
			$('#form').slideToggle();
		},
		addDoc: function(e) {
			// get length, # of files - and ask couchdb for some uuids
			
			// the general concept is that someone can simply upload
			// both cover-art and documents in a single go! 
			// this will happen for books/movies for example
			
			// In this scenario - we have to only create docs for the data,
			// and then associate the file & cover art as doc _attachments
			// when saving the doc to couch, we save the doc (without attachments),
			// then publish/post the _attachments separately using the docid/attachmentGUUID
			
			// if we are simply uploading photographs, it is a 1:1 mapping
			// and we simply have to enter the meta-data for the photo
			var files = {};
			var images = {};
			
			// store all the docs into file or image dicts
			var file, title, dot, ext="", doc;
			for(var i=0; i<e.target.files.length; i++)
			{
				file = e.target.files[i];
				title = file.name;
				dot = title.lastIndexOf(".");
				if(dot>0) {
					ext = title.substring(dot+1, title.length).toLowerCase();
					title = title.substring(0,dot);
				}
				// create document - we'll read the files from disk when we upload
				doc = new Doc({
						cid: i,
						title: title,
						description: "",
						file: file
				});
				if(file.type.match("image.*")) {
					images[title] = doc;
				}
				else {
					files[title] = doc;
				}
			}
			
			// at this point - our dicts are populated - time to associate cover art
			var self = this;
			$.each(files, function(key){
				var image = images[key];
				var doc = files[key];
				if(image) {
					// read image in and attach as cover
					var imageReader = new FileReader();
					imageReader.onload = function(e) {
						doc.set("_cover", e.target.result);
						self.render_cover(doc.get("cid"), e.target.result);
					};
				  imageReader.readAsDataURL(image.get("file"));
				}
				var docReader = new FileReader();
				docReader.onload = function(e) {
					doc.set("_data", e.target.result);
				};
			  docReader.readAsDataURL(doc.get("file"));
			
				// add this document to the uploads collection
				uploads.add(doc);
			});
		},
		render: function(doc) {
			$(this.el_view).append(this.template(doc.toJSON()));
		},
		render_cover: function(cid, data) {
			$(this.el_view).find('#cover-'+cid).attr("src", data);
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
});
