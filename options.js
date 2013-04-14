var HOME_URL = 'http://www.memrise.com/home/';
var settings = new Store("settings", DEFAULTS);

$(document).ready(function() {
	// Text input logic
	$('input[type=text]')
		.each(function(i, el) {
			var pref = $(this).attr('pref');
			$(this).val(settings.get(pref));
		})
		.blur(function() {
			var val  = $(this).val();
			var pref = $(this).attr('pref');

			// Reset to default if value is invalid
			if (val.length === 0 || parseInt(val).toString() !== val) {
				settings.remove(pref);
				$(this).val(settings.get(pref));
			} else {
				settings.set(pref, val);
			}
		});

	// Topics
	$.get(HOME_URL, function(html) {
		var $html = $($.parseHTML(html));

		var topics = $.makeArray($('.whitebox .groupname', $html)).map(function(e) {
			return {
				name: e.innerText,
				slug: e.innerText
						.toLowerCase()
						.replace(/[^a-z\s]*/g, '')
						.replace(/\s+/, '-')
			}
		});

		$('#topics .loading').hide();

		if (topics && topics.length > 0) {
			if (settings.get('topics') == undefined) {
				console.log('topics was empty');
				settings.set('topics', {});
			}

			var store = settings.get('topics');

			topics.forEach(function(topic) {
				var label = $('<label>', {
					text: topic.name
				});

				var checkBox = $('<input>', {
					type: 'checkbox',
					name: topic.slug
				})

				checkBox.change(function() {
					var $box = $(this);
					var slug = $box.attr('name');

					store[slug] = $box.prop('checked');
					settings.set('topics', store);
				});

				checkBox.prependTo(label);
				$('#topics .checkboxes').append(label);

				if (!store.hasOwnProperty(topic.slug) || store[topic.slug] === true) {
					store[topic.slug] = true; // Enable by default
					checkBox.prop('checked', true);
				}
			});

			settings.set('topics', store);
		}
	});

	$('#reset').click(function() {
		Store.clear();
		console.log('localStorage cleared');
	});

	$('#refresh').click(function() {
		chrome.extension.sendMessage('refresh');
	});
});