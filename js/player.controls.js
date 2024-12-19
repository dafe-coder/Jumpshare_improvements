JSPlayer.Controls = {
	playerWrap: null,

	init: function (playerWrap) {
		this.playerWrap = playerWrap
		this.theatreBtn = document.getElementById('theatre-mode')
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
	toggleFullscreenStyles: e => {
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
		if (!player.muted) {
			player.muted = true
			JSPlayer.Helper.toggleSiblingElement(muteBtn, 'svg')
			this.updateProgressVolume(0)
		} else {
			player.muted = false
			JSPlayer.Helper.toggleSiblingElement(muteBtn, 'svg', true)
			this.updateProgressVolume(playerVolumeCount)
		}
	},
	updateProgressVolume: percentage => {
		const progressPercent = percentage * 100
		volumeSlider.querySelector('.volume-slider-progress').style.width =
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
