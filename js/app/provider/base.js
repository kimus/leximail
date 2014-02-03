var BaseProvider = function()
{
	this.config = {};
};

BaseProvider.prototype = {
	getInfo: function()
	{
		return {
			id: 'base',
			label: 'Base Provider',
			description: 'Extendable Provider',
			icon: 'img/email.png'
		};
	},

	initialize: function(config)
	{
		this.config = config;
	},

	connect: function()
	{
	},

	disconnect: function()
	{
	},

	prepare: function()
	{

	},

	fetchMessages: function()
	{

	},

	fetchFolders: function()
	{

	},

	fetchLabels: function()
	{

	},

	fetchMessage: function(id)
	{

	}
};

module.exports = BaseProvider;