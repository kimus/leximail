var moment = require('moment');
var htmlToText = require('html-to-text');
var config = require('../core/preferences');

var Shell = {

	init: function()
	{
		var self = this;

		self.sync = {
			timer: false,
			active: false,
			start: function()
			{
				if (!self.sync.timer)
				{
					self.sync.active = true;
					var i = -7;
					self.sync.timer = setInterval(function()
					{
						self._syncbutton.css('background-position-y', (i * 36) + 5);
						i--;
						if (i < -7) { i = -0; }
						if (!self.sync.active && i == -7)
						{
							clearInterval(self.sync.timer);
							self.sync.timer = false;
						}
					}, 35);
				}
			},
			end: function()
			{
				self.sync.active = false;
			}
		};

		var d = $.Deferred(function()
		{
			var def = this;
			var body = $(window.document.body);

			//
			// application shell
			// 

			body.html(app.templates.main({}));

			var height = $(window).height();
			var width = $(window).width();

			// Splitters
			$('#app').splitter({ sizeLeft: 200 });
			$('#right-side').splitter({ sizeLeft: 300 });

			$(window).resize(function()
			{
				if (height != $(window).height() || width != $(window).width())
				{
					// Redefines
					height = $(window).height();
					width = $(window).width();

					// Splitter
					$('#app').trigger('resize');

					self.redraw();
				}
			});

			console.log('shell loaded');

			//
			// Login (temporary just for testing)
			// 

			body.append(app.templates.login({
				username: config.get('username'), 
				password: config.get('password')
			}));

			$('#loading form').on('submit', function()
			{
				$('#loading').hide();
				$('#overlay').show();

				var username = $('#loading #username').val();
				var password = $('#loading #password').val();

				config.set('username', username);
				config.set('password', password);
				config.save();

				self.sync.start();

				def.resolve(true);

				return false;
			});

			console.log('login form loaded');


			//
			// Buttons
			//
			
			self._syncbutton = $('#refresh-button');

		});

		return d;
	},

	list: function(messages)
	{
		var self = this;

		var msglist = $('#messages-list');
		$.each(messages, function(i, m)
		{
			var txt = (m.text || m.html).substr(0, 50);

			msglist.append(app.templates.row({
				id: i,
				account: 'Google Mail',
				icon: '',
				date: moment(m.date).calendar(),
				subject: m.subject,
				snipet: htmlToText.fromString(txt),
				read: false,
				starred: false
			}));
		});

		msglist.find('li').off('click').on('click', function()
		{
			msglist.find('.selected').removeClass('selected');
			$(this).addClass('selected');

			var id = $(this).data('id');
			var m = messages[id];

			self.open(m);

		});

		// show all
		$('#overlay').hide();
		self.sync.end();
	},

	open: function(message)
	{
		var win = $('#post-window');
		win.empty();

		win.append(app.templates.message({
			id: message.id,
			subject: message.subject,
			date: moment(message.date).calendar()
		}));

		var html = !message.html ? '<pre style="white-space: pre-line">' + message.text + '</pre>' : message.html;

		win.find('iframe').contents().find('html').html(html);

		this.redraw();
	},

	redraw: function()
	{
		// Email body size
		var full = $('#message').height();
		var h = $('#post > header').height();
		var bb = $('#message > .bar').height();
		var v = full - (h + bb + 2);

		console.log('header:', full);
		console.log('header:', h);
		console.log('bar:', bb);
		console.log('view:', v);

		$('#post > .body').height(v);
	},

	settings: function()
	{
		var self = this;

		return [
			{
				provider: 'imap',
				label: 'Gmail Account',
				options: {
					user: config.get('username'),
					password: config.get('password'),
					host: 'imap.gmail.com',
					port: 993,
					tls: true,
					tlsOptions: { rejectUnauthorized: false }
				}
			}
		];		
	}
};

module.exports = Shell;