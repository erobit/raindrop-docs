
/* couchdb views */
exports.views = {
	get_tabs: {
		map: function (doc) {
			if(doc.type)
			{
				if (doc.type == 'doc')
				{
					emit(doc.tab, doc.tags);
				}
			}
		},
		reduce: function(keys, values) {
			return values.join(',').split(',');
		}
	},
	get_docs: {
		map: function(doc) {
			if(doc.type)
			{
				if (doc.type == 'doc')
				{
					doc.tags.forEach(function (tag) { emit([doc.tab, tag], null); });
				}
			}
		}
	}
};

/* couchdb rewrite rules */
exports.rewrites = [
	{
		"from": "",
		"to": "/index.html",
		"method": "GET",
		"query": {}
	},
	{
		"from": "tabs",
		"to": "_view/get_tabs?group_level=1",
		"method": "GET",
		"query": {
		}
	}
];