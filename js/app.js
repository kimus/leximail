global.$ = $;

var app = {
	templates: require('dot').process({ path: "./views"})
};
global.app = app;
var shell = require('./js/app/widget/appshell');

shell.init().then(function()
{
	var settings = shell.settings();

	var providers = [];

	$.each(settings, function(i, o)
	{
		var ProviderClass = require('./js/app/provider/' + o.provider);

		var d = $.Deferred(function()
		{
			var def = this;

			var provider = new ProviderClass();

			provider.initialize(o.options);
			provider.connect().then(
				function()
				{
					console.log("authentication successful!");
					def.resolve(provider);
				},
				function()
				{
					console.log("authentication falied!");
					def.resolve(provider);
				}
			);
			
		});
		providers.push(d);
	});

	if (providers.length > 0)
	{
		$.when.apply($, providers).done(function()
		{
			var prepares = [];
			$.each(arguments, function(i, p)
			{
				prepares.push(p.prepare());
			});

			var messages = [];
			$.when.apply($, prepares).done(function()
			{
				$.each(arguments, function(j, p)
				{
					var msgs = p.fetchMessages();
					messages = messages.concat(msgs);
					p.disconnect();
				});

				shell.show(messages);
			});
		});
	}
});
