JSPlayer.Controls = {
	playerControlsTimeout: null,
	playerVolumeCount: 0.5,
	volumeSlider: null,
	theatreBtn: null,
	sliderThumb: null,
	playerWrap: null,
	theatreModeID: null,
	playbackRate: null,
	sliderRail: null,
	currentTime: null,
	controls: null,
	playOrPauseBtn: null,
	dataChapters: null,
	muteBtn: null,
	commentsContainer: null,
	duration: null,
	showPlayerOverlayTimer: null,
	annotationCanvasElement: null,
	playerOverlayStart: null,
	showAnnotationBtn: null,
	playerOverlayEnd: null,
	playerOverlayBtnEnd: null,
	fullScreenBtn: null,
	loadingBgSpinner: null,


	init: function () {
		this.playerWrap = document.querySelector('.player-wrap')
		this.playOrPauseBtn = document.getElementById('play-or-pause')
		this.muteBtn = document.getElementById('mute')
		this.currentTime = document.getElementById('controls-current-time')
		this.duration = document.getElementById('controls-duration')
		this.playbackRate = document.getElementById('playback-rate')
		this.showPlayerOverlayTimer = document.querySelector('.show-player-timer')
		this.controls = document.querySelector('.controls')
		this.commentsContainer = document.querySelector('.controls-comments')
		this.annotationCanvasElement = document.getElementById('annotation_canvas')
		this.sliderThumb = document.getElementById('slider-thumb')
		this.sliderRail = document.getElementById('controls-time-rail')
		this.playerOverlayStart = document.querySelector('.player-overlay-start')
		this.theatreBtn = document.getElementById('theatre-mode')
		this.fullScreenBtn = document.getElementById('fullscreen')
		this.volumeSlider = document.getElementById('volume-slider')
		this.playerVolumeCount = 0.5

		this.showAnnotationBtn = document.querySelector('#show-annotation')

		this.playerOverlayEnd = document.querySelector('.player-overlay-end')
		this.playerOverlayBtnEnd = document.querySelector(
		'.player-overlay-button-end')
		this.loadingBgSpinner = document.querySelector('.loading-bg-img')
	
		
		// TODO
		this.dataChapters = dataChapters

		// Hide native controls
		this.controls = false;

		// ARIA attributes for control buttons
		this.playOrPauseBtn.setAttribute('aria-label', 'Play/Pause')
		this.muteBtn.setAttribute('aria-label', 'Mute')
		this.fullScreenBtn.setAttribute('aria-label', 'Fullscreen')
	},

	bootstrap : function()
	{
		this.addEventListeners()
	},

	addEventListeners: function () {

		playerOverlayBtnEnd.addEventListener('click', () => {
			const playerCtaButtonDefault = document.querySelector(
				'.player-cta-button-default'
			)
			JSPlayer.Controls.commentsContainer.style.visibility = 'visible'
			JSPlayer.player.currentTime = 0
			JSPlayer.player.play()
			JSPlayer.Controls.playerOverlayEnd.style.display = 'none'
			playerCtaButtonDefault.classList.remove('hidden')
			JSPlayer.Helper.toggleSiblingElement(JSPlayer.Controls.playOrPauseBtn, 'svg')
		});

		document.addEventListener('keydown', e => {
			const skipAmount = 10
			const isTyping = ['INPUT', 'TEXTAREA'].includes(
				document.activeElement.tagName
			)
	
			if (JSPlayer.player.currentTime > 0 && !isTyping) {
				if (e.code === 'Space') {
					e.preventDefault()
					if (JSPlayer.player.paused || JSPlayer.player.ended) {
						JSPlayer.Controls.preparePlayerWhenStartPlaying()
						JSPlayer.player.play()
						JSPlayer.Helper.toggleSiblingElement(JSPlayer.Controls.playOrPauseBtn, 'svg')
					} else {
						JSPlayer.player.pause()
						JSPlayer.Helper.toggleSiblingElement(JSPlayer.Controls.playOrPauseBtn, 'svg', true)
					}
				}
				if (e.code === 'ArrowLeft') {
					JSPlayer.player.currentTime -= skipAmount
					JSPlayer.Chapters.chooseActiveChapter()
					JSPlayer.updateSlider(dataChapters)
				}
				if (e.code === 'ArrowRight') {
					JSPlayer.player.currentTime += skipAmount
					JSPlayer.Chapters.chooseActiveChapter()
					JSPlayer.updateSlider(dataChapters)
				}
				if (e.code === 'KeyK') {
					JSPlayer.Controls.toggleFullScreen()
				}
			}
		})

		// Theatre mode
		theatreBtn.addEventListener('click', () => {
			JSPlayer.Controls.theatreMode()
			JSPlayer.Settings.resizeVideoPlayerTheatreMode()
			JSPlayer.Annotation.resizeAnnotationCanvas()
		})

		// Fullscreen
		fullScreenBtn.addEventListener('click', () => {
			JSPlayer.Controls.toggleFullScreen()
		})

	},

	updateVolumeCount: function (percentage) {
		JSPlayer.playerVolumeCount = percentage
		JSPlayer.player.volume = percentage
		this.updateProgressVolume(percentage)
	},

	// Fullscreen
	toggleFullScreen: function () {
		if (!document.fullscreenElement) {
			if (JSPlayer.playerWrap.requestFullscreen) {
				JSPlayer.playerWrap.requestFullscreen()
			} else if (JSPlayer.playerWrap.webkitRequestFullscreen) {
				JSPlayer.playerWrap.webkitRequestFullscreen()
			} else if (JSPlayer.playerWrap.msRequestFullscreen) {
				JSPlayer.playerWrap.msRequestFullscreen()
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
		if (!JSPlayer.player.muted) {
			JSPlayer.player.muted = true
			JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg')
			this.updateProgressVolume(0)
		} else {
			JSPlayer.player.muted = false
			JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg', true)
			this.updateProgressVolume(JSPlayer.playerVolumeCount)
		}
	},
	updateProgressVolume: function (percentage) {
		const progressPercent = percentage * 100
		this.volumeSlider.querySelector('.volume-slider-progress').style.width =
			progressPercent + '%'
	},

	// Theatre mode
	theatreMode: function () {
		JSPlayer.playerWrap.classList.toggle('theatre-mode-wrap')
		if (JSPlayer.playerWrap.classList.contains('theatre-mode-wrap')) {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg')
		} else {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg', true)
		}
	},

	preparePlayerWhenStartPlaying: function() {
		JSPlayer.Controls.commentsContainer.style.visibility = 'visible'
		// Generate CTA button
		if (!JSPlayer.CTA.isCTAButtonGenerated) {
			JSPlayer.CTA.generateCTAButton(dataCTA)
			JSPlayer.CTA.isCTAButtonGenerated = true
		}
		playerOverlayStart.style.display = 'none'
		document
			.querySelector('.player-wrap')
			.classList.add('player-overlay-played')
		JSPlayer.Helper.toggleSiblingElement(playOrPauseBtn, 'svg')
		JSPlayer.showHideControls()
		JSPlayer.player.play()
	}
}
