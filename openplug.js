function oPlug(){	
	var opts = {
		autoWoot: true,
		autoJoin: false,
		vidHide: true,
		largeVid: false,
		notifications: false,
		volIncrement: 8
	};

	var handler = {
		ADVANCE: function(_){
			if (opts.autoWoot) util.woot();
		},
		WLUPDATE: function(_){
			if (opts.autoJoin) util.join();
		},
		COMMAND: function(_){
			switch(_.split(' ')[0].toLowerCase()) {
				case '/volumeincrement':
					opts.volIncrement = _.split(' ')[1];
					util.oPlugLog('Volume scroll increment is now set to ' + opts.volIncrement);
					break;
			}
		}
	};

	var util = {
		oPlugLog: function(text){
			var $chat = $('#chat-messages');

			var $oMessage = $('<div />', { class: 'cm oplug' }).append(
				$('<img />', { class: 'oplug-icon', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAxCAYAAABQxxDJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4AMFEzED69pw4QAAA39JREFUWMPtmE+IHEUUh7+anVnXi7K4MSYqKhqUSHROYVbwYDB48iZBEQSTi5KDBsGz5uRBNAcPLuhB1JNIBMGIIEuCklEEd7PZJJqAoPlHNmQTUZNNdvfzkJrQznT39JiZjmAeNN1Vr9+rX//q9atXhRrUx9RJ9bi6X92iDgOolCbqBi/LaXWneiC2d1C2qLvVOXW9OqKuUpsR0D1lYqkAa4AmMANcCCGcACaj/q6ywcwBa4FbQwioAahH/amyp+npOCWH1HfVPbG9q4vdv9LlSVBvAWaBlW26DSGEyZbzEEJyoKF4VYE7gTGgFpk8ClwAloHFpF3rOUuqQNYbQylA1gDrgSeAR4B7M2yPxTj8Sv0mhHAghsBlBrJAqWPqSTvl8cQ7d6gfqL/Zu5xQP1Pv7zqN3cCoL6gLXr0sqa+pQ5mAcsBsUt+x//KpujoVUA6YXwo6n49Ze0Y9VdBmv/pAB6AcMHlyTN0as3VNrcarpo6qm9Wfu/g4qN5WlJk0OaJuzsop7bSrT6rTOf4+VIev2BUAsxzvH6mriia9ll69Wd3R5ispz17xV5CZt/qQ6V/O8H1RrRVl5ku1cjV1TYKliYwx3i4CZk5d168iKybPwynjHFdHK13sd4YQZnJTeC8LYQhHgffjupWUUWBjN2bu63fpGX/98yljvZnHzKEQwpF+sZJYdOeBb1PUd+eB2TXAgvzzlL7VeWBm+8lKm6/ZFPV4HpizAyww/8qqgbPkYtk7lTww4b8Ehv81mGqRl+rNxXbgTjWq1puLTDX+6eLh5iWmG7VMm34w8wzwR9yCLADbgQ4gANONWutxK/BntDkPbOvXNG0Hbox7oyqwrd5cGOli8yowEm2Ggdf7BabW1l6GcEO3HNdrSFz/m66D6TW754FZGiCY0yl95/LALAyMlhB+Ar5u656oXos5igXbRuAp4EFgdwhhsnqtgjWEIPBJvHoK4EpnAFZCj0EaUiq+wgGcXNQOt+nmpxrVbpXgybb2r0VW7aWMVD2UeH4eeCV+XQX4uLWad6zae5eYHh8CeA54McHKBMBDey+xb7yWGUxb4r7lR/WleJij+l2BsqInXZ5NC8y+eNSxMtH3RQS0ruwMvAI4CJxL7JFm4n2s7H9+j/q7Wo/tm9QfIjO3lw3m0cRBzvfqmdh+b4A7ylxAm+IB4dl41vtG7C91u/I3/996SjDjeyQAAAAASUVORK5CYII=' }),
				$('<div />', { class: 'msg' }).append(
					$('<div />', { class: 'from oplug'}).append(
						//Make username clickable and open website in new tab?
						$('<div />', { class: 'un', html: 'Plug'})
					),
					$('<div />', { class: 'text', html: text })
				)
			);

			$chat.append($oMessage);
		},
		woot: function(){
			API.getUser().id != undefined && API.getDJ().id !== API.getUser().id && $('#woot').click();
		},
		join: function(){
			API.getWaitList().length < 50 && API.getWaitListPosition() === -1 && $('#dj-button').hasClass('is-wait') && API.djJoin();
		},
		vidhide: function(){
			$('#playback-container').toggle();
		}
	};

	var init = function(){
		API
			.off(API.ADVANCE, handler.ADVANCE)
			.off(API.WAIT_LIST_UPDATE, handler.WLUPDATE)
			.off(API.CHAT_COMMAND, handler.COMMAND);
			
		$('#openplug-css').remove();
		$('.openplug').remove();
		$('.op-title').unbind('all');
		$('.op-row').unbind('click');
		$('#volume, #playback').unbind('mousewheel');
		$('head').append(
			$('<link />', { id: 'openplug-css', rel: 'stylesheet', href: '//dl.dropbox.com/s/6ikvchvpd7taptl/openplug.css', type: 'text/css' })
		);

		$.getScript('//dl.dropbox.com/s/sxkzizxhmaaaon7/jquery-ui.min.js').done(renderUI);

		API
			.on(API.ADVANCE, handler.ADVANCE, this)
			.on(API.WAIT_LIST_UPDATE, handler.WLUPDATE, this)
			.on(API.CHAT_COMMAND, handler.COMMAND, this);

		$('#volume, #playback').bind('mousewheel', function(_){
			_.deltaY > 0 ? API.setVolume(API.getVolume() + opts.volIncrement) : API.setVolume(API.getVolume() - opts.volIncrement)
		});

		util.oPlugLog('Successfully Started. Hello World!');
	};

	var adaptSettings = function(){
		opts.autoWoot ? $('.op-row.autowoot > .icon-check-blue').show() && util.woot() : $('.op-row.autowoot > .icon-check-blue').hide();
		opts.autoJoin ? $('.op-row.autojoin > .icon-check-blue').show() && util.join() : $('.op-row.autojoin > .icon-check-blue').hide();
		opts.vidHide ? $('.op-row.vidhide > .icon-check-blue').show() && util.vidhide() : $('.op-row.vidhide > .icon-check-blue').hide();
	};

	var renderUI = function(){
		var $app = $('#app');

		var $menu = $('<div />', { class: 'openplug' }).append(
			$('<div />', { class: 'op-title' }).append(
				$('<span />', { class: 'title-text', html: 'OPEN' }).append(
					$('<span />', { class: 'title-variant', html: 'opug'})
				)
			),
			$('<div />', { class: 'op-row autowoot' }).append(
				$('<div />', { class: 'row-text', html: 'AutoWoot'}),
				$('<i />', { class: 'icon icon-check-blue' })
			),
			$('<div />', { class: 'op-row autojoin' }).append(
				$('<div />', { class: 'row-text', html: 'AutoJoin'}),
				$('<i />', { class: 'icon icon-check-blue' })
			),
			$('<div />', { class: 'op-row vidhide' }).append(
				$('<div />', { class: 'row-text', html: 'Hide Video'}),
				$('<i />', { class: 'icon icon-check-blue' })
			),
			$('<div />', { class: 'op-row largevid' }).append(
				$('<div />', { class: 'row-text', html: 'Large Video'}),
				$('<i />', { class: 'icon icon-check-blue' })
			),
			$('<div />', { class: 'op-row notifications' }).append(
				$('<div />', { class: 'row-text', html: 'Notifications'}),
				$('<i />', { class: 'icon icon-check-blue' })
			)
		);

		$app.append($menu);
		$menu.draggable({handle: '.op-title', opacity: 0.90, snap: '.app-right, #vote, #footer, .app-header, #playback-container, #dj-button', snapTolerance: 8, iframeFix: true, distance: 5, stop: function(){}})

		$('.op-title')
		.bind('mouseover', function(_){
			if (_.buttons !== 1) 
				$('body').append("<div id='tooltip' class='right'><span>Drag Me, or Double Click Me!</span></div>");
				$('#tooltip')
					.append("<div class='corner'></div>")
					.css('left', $('.op-title').offset().left - 2)
					.css('top', $('.op-title').offset().top - 35);
		})
		.bind('mouseout', function(){
			$('#tooltip').remove();
		})
		.bind('mousedown', function(){
			$('#tooltip').remove();
		})
		.bind('dblclick', function(){
			$('.op-row').toggle(290, 'linear');
		});

		$('.op-row').bind('click', function(){
			switch($(this)[0].className.split(' ')[1]) {
				case 'autowoot':
					opts.autoWoot = !opts.autoWoot;
					opts.autoWoot ? $('.op-row.autowoot > .icon-check-blue').show() && util.woot() : $('.op-row.autowoot > .icon-check-blue').hide();
					console.log(opts.autoWoot);
				break;
				case 'autojoin':
					opts.autoJoin = !opts.autoJoin;
					opts.autoJoin ? $('.op-row.autojoin > .icon-check-blue').show() : $('.op-row.autojoin > .icon-check-blue').hide();
					console.log(opts.autoJoin);
				break;
				case 'vidhide':
					opts.vidHide = !opts.vidHide;
					opts.vidHide ? $('.op-row.vidhide > .icon-check-blue').show() && util.vidhide() : $('.op-row.vidhide > .icon-check-blue').hide() && util.vidhide();
					console.log(opts.vidHide);
				break;
				case 'largevid':
					opts.largeVid = !opts.largeVid;
					opts.largeVid ? $('.op-row.largevid > .icon-check-blue').show() : $('.op-row.largevid > .icon-check-blue').hide();
					console.log(opts.largeVid);
				break;
				case 'notifications':
					opts.notifications = !opts.notifications;
					opts.notifications ? $('.op-row.notifications > .icon-check-blue').show() : $('.op-row.notifications > .icon-check-blue').hide();
					console.log(opts.notifications);
					break;
			}
		})

		adaptSettings();
	};


	init();
};

oPlug();