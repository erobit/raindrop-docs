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
	}
};