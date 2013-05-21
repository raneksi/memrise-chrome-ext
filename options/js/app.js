var app = app || {};

(function($) {
	'use strict';

	app.WhatsNewView = Marionette.ItemView.extend({
		initialize: function() {
			this.on('fetch', this.render);

			this.fetch(function(data) {
				this.data = data;
				this.trigger('fetch');	
			}.bind(this));
		},

		fetch: function(cb) {
			$.get(chrome.extension.getURL('CHANGES.html'), function(data) {
				cb(data);
			});
		},

		render: function() {
			this.$el.html(this.data);
		}
	});

	app.Layout = Backbone.Marionette.Layout.extend({
		el: '#main',

		regions: {
			content: '#content'
		}
	});
})(jQuery);

$(function() {
	var layout   = new app.Layout();
	var whatsnew = new app.WhatsNewView();
	var settings = new app.SettingsView();

	layout.content.show(settings);
});
