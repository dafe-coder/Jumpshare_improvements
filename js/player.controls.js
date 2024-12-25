JSPlayer.Controls = {
	playerWrap: null,
	player: null,
	playerVolumeCount: 0.5,
	volumeSlider: null,
	muteBtn: null,
	theatreBtn: null,

	init: function (player, playerWrap, playerVolumeCount) {
		this.playerVolumeCount = playerVolumeCount
		this.player = player
		this.playerWrap = playerWrap
		this.theatreBtn = document.getElementById('theatre-mode')
		this.muteBtn = document.getElementById('mute')
		this.volumeSlider = document.getElementById('volume-slider')
	},

	updateVolumeCount: function (percentage) {
		this.playerVolumeCount = percentage
		this.player.volume = percentage
		this.updateProgressVolume(percentage)
	},

	// Fullscreen
	toggleFullScreen: function () {
		if (!document.fullscreenElement) {
			if (this.playerWrap.requestFullscreen) {
				this.playerWrap.requestFullscreen()
			} else if (this.playerWrap.webkitRequestFullscreen) {
				this.playerWrap.webkitRequestFullscreen()
			} else if (this.playerWrap.msRequestFullscreen) {
				this.playerWrap.msRequestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			} else if (document.msExitFullscreen) {
			}
		}
	},
	toggleFullscreenStyles: function (e) {
		e.preventDefault()

		const isFullscreen = !!document.fullscreenElement
		if (isFullscreen) {
			setTimeout(() => {
				document.querySelector('.controls').style.position = 'fixed'
			}, 0)
		} else {
			document.querySelector('.controls').style.position = 'absolute'
		}
	},

	// Volume
	mute: function () {
		if (!this.player.muted) {
			this.player.muted = true
			JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg')
			this.updateProgressVolume(0)
		} else {
			this.player.muted = false
			JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg', true)
			this.updateProgressVolume(this.playerVolumeCount)
		}
	},
	updateProgressVolume: function (percentage) {
		const progressPercent = percentage * 100
		this.volumeSlider.querySelector('.volume-slider-progress').style.width =
			progressPercent + '%'
	},

	// Theatre mode
	theatreMode: function () {
		this.playerWrap.classList.toggle('theatre-mode-wrap')
		if (this.playerWrap.classList.contains('theatre-mode-wrap')) {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg')
		} else {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg', true)
		}
	},
}
