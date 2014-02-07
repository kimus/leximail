var fs = require('fs'),
	nconf = require('nconf');

var Preferences = {
	path: app.gui.App.dataPath + '/preferences.json',

	load: function()
	{
		nconf.file({ file: Preferences.path });
	},

	get: function(key)
	{
		return nconf.get(key);
	},

	set: function(key, value)
	{
		return nconf.set(key, value);
	},

	save: function(cfg)
	{
		nconf.save(function(err)
		{
			console.log(err);
		});
	}
};

Preferences.load();

module.exports = Preferences;