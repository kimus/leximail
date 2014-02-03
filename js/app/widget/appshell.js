var moment = require('moment');
var htmlToText = require('html-to-text');


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
				}
			});

			console.log('shell loaded');

			//
			// Login (temporary just for testing)
			// 
			body.append(app.templates.login({}));

			$('#loading form').on('submit', function()
			{
				$('#loading').hide();
				$('#overlay').show();

				self.username = $('#loading #username').val();
				self.password = $('#loading #password').val();

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

	show: function(messages)
	{
		var self = this;

		var msglist = $('#messages-list');
		$.each(messages, function(i, m)
		{
			var txt = (m.text || m.html).substr(0, 200);
			console.log(txt);

			msglist.append(app.templates.message({
				id: i,
				date: moment(m.date).calendar(),
				subject: m.subject,
				snipet: htmlToText.fromString(txt)
			}));
		});

		// show all
		$('#overlay').hide();
		self.sync.end();
	},

	settings: function()
	{
		var self = this;

		return [
			{
				provider: 'imap',
				label: 'Gmail Account',
				options: {
					user: self.username,
					password: self.password,
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