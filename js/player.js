const JSPlayer = {
	Settings: {
		sliderThumb: null,
		player: null,

		init: function (player, sliderThumb) {
			this.sliderThumb = sliderThumb
			this.player = player
		},

		themeColor: {
			primary: '#1891ED',
			secondary: 'rgba(255, 255, 255, 0.5)',
		},
		videoSize: '640x360',
		annotation: {
			annotation_json:
				'[{"color":"#F73D72","id":"0","type":"rectangle","x1":"49.19","y1":"20.98","x2":"82.96","y2":"77.73"}]',
		},

		// Methods
		applyPlayerColorTheme: function ({
			primary = JSPlayer.Settings.themeColor.primary,
			secondary = JSPlayer.Settings.themeColor.secondary,
		}) {
			JSPlayer.Settings.themeColor.primary = primary
			JSPlayer.Settings.themeColor.secondary = secondary
			this.sliderThumb.style.backgroundColor = primary
			document.querySelector('.player-overlay-button svg path').style.fill =
				primary
			document.documentElement.style.setProperty('--pulse-color', primary)
		},

		hideTextTracks: function () {
			for (let i = 0; i < player.textTracks.length; i++) {
				player.textTracks[i].mode = 'hidden'
			}
		},
	},
	Utils: {
		updateSlider: null,
	},
}
