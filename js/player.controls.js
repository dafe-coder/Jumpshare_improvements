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
	controlsTimeRail: null,
	playerCtaButtonDefault: null,
	isPreviewPlaying: true,
	PREVIEW_DURATION: 5,

	bootstrap: function () {
		this.init()
		this.addEventListeners()
	},

	init: function () {
		this.playerWrap = document.querySelector('.player-wrap')
		this.playOrPauseBtn = document.getElementById('play-or-pause')
		this.muteBtn = document.getElementById('mute')
		this.currentTime = document.getElementById('controls-current-time')
		this.duration = document.getElementById('controls-duration')
		this.playbackRate = document.getElementById('playback-rate')
		this.showPlayerOverlayTimer = document.querySelector('.show-player-timer')
		this.commentsContainer = document.querySelector('.controls-comments')
		this.annotationCanvasElement = document.getElementById('annotation_canvas')
		this.sliderThumb = document.getElementById('slider-thumb')
		this.sliderRail = document.getElementById('controls-time-rail')
		this.playerOverlayStart = document.querySelector('.player-overlay-start')
		this.theatreBtn = document.getElementById('theatre-mode')
		this.fullScreenBtn = document.getElementById('fullscreen')
		this.volumeSlider = document.getElementById('volume-slider')
		this.controls = document.querySelector('.controls')
		// Slider player (time rail)
		this.controlsTimeRail = document.getElementById('controls-time-rail')
		this.playerVolumeCount = 0.5

		this.showAnnotationBtn = document.querySelector('#show-annotation')

		this.playerOverlayEnd = document.querySelector('.player-overlay-end')
		this.playerOverlayBtnEnd = document.querySelector(
			'.player-overlay-button-end'
		)
		this.loadingBgSpinner = document.querySelector('.loading-bg-img')

		// TODO
		this.dataChapters = dataChapters

		//TODO Hide native controls
		////this.controls = false;

		// ARIA attributes for control buttons
		this.playOrPauseBtn.setAttribute('aria-label', 'Play/Pause')
		this.muteBtn.setAttribute('aria-label', 'Mute')
		this.fullScreenBtn.setAttribute('aria-label', 'Fullscreen')

		// Player wrap init height
		JSPlayer.Events.resizeVideoPlayer()
	},

	addEventListeners: function () {
		document.addEventListener('fullscreenchange', e => {
			JSPlayer.Controls.toggleFullscreenStyles(e)
			JSPlayer.resizeVideoPlayerTheatreMode()
		})

		document.addEventListener('webkitfullscreenchange', e => {
			JSPlayer.Controls.toggleFullscreenStyles(e)
			JSPlayer.resizeVideoPlayerTheatreMode()
		})

		document.addEventListener('mozfullscreenchange', e => {
			JSPlayer.Controls.toggleFullscreenStyles(e)
			JSPlayer.resizeVideoPlayerTheatreMode()
		})

		// overlay player start
		this.playerOverlayStart.addEventListener('click', () =>
			this.preparePlayerWhenStartPlaying()
		)

		this.controls.addEventListener('mousemove', () => {
			JSPlayer.showHideControls()
			clearTimeout(JSPlayer.Controls.playerControlsTimeout)
		})

		this.playerWrap.addEventListener('mouseleave', () => {
			if (!JSPlayer.player.paused) {
				JSPlayer.showHideControls(true)
			}
		})

		this.fullScreenBtn.addEventListener('click', () => {
			JSPlayer.Controls.toggleFullScreen()
		})

		this.controlsTimeRail.addEventListener('mousedown', event => {
			JSPlayer.Events.isDragging = true
			JSPlayer.Events.dragType = 'time'
			JSPlayer.moveSlider(
				event,
				JSPlayer.Controls.controlsTimeRail,
				JSPlayer.Events.dragType
			)
		})

		this.playOrPauseBtn.addEventListener('click', e => JSPlayer.playOrPause(e))

		this.muteBtn.addEventListener('click', () => JSPlayer.Controls.mute())

		this.playbackRate.addEventListener('click', () =>
			JSPlayer.choosePlaybackRate()
		)

		this.playerOverlayBtnEnd.addEventListener('click', function () {
			JSPlayer.Controls.commentsContainer.style.visibility = 'visible'
			JSPlayer.player.currentTime = 0
			JSPlayer.player.play()
			JSPlayer.Controls.playerOverlayEnd.style.display = 'none'
			if (JSPlayer.Controls.playerCtaButtonDefault) {
				JSPlayer.Controls.playerCtaButtonDefault.classList.remove('hidden')
			}
			JSPlayer.Helper.toggleSiblingElement(
				JSPlayer.Controls.playOrPauseBtn,
				'svg'
			)
		})

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
						JSPlayer.Helper.toggleSiblingElement(
							JSPlayer.Controls.playOrPauseBtn,
							'svg'
						)
					} else {
						JSPlayer.player.pause()
						JSPlayer.Helper.toggleSiblingElement(
							JSPlayer.Controls.playOrPauseBtn,
							'svg',
							true
						)
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
		this.theatreBtn.addEventListener('click', () => {
			JSPlayer.Controls.theatreMode()
			JSPlayer.resizeVideoPlayerTheatreMode(10)
			JSPlayer.Events.resizeVideoPlayer()
		})

		// Volume slider
		this.volumeSlider.addEventListener('mousedown', event => {
			JSPlayer.Events.isDragging = true
			JSPlayer.Events.dragType = 'volume'
			JSPlayer.moveSlider(
				event,
				JSPlayer.Controls.volumeSlider,
				JSPlayer.Events.dragType
			)
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
			if (JSPlayer.Controls.playerWrap.requestFullscreen) {
				JSPlayer.Controls.playerWrap.requestFullscreen()
			} else if (JSPlayer.Controls.playerWrap.webkitRequestFullscreen) {
				JSPlayer.Controls.playerWrap.webkitRequestFullscreen()
			} else if (JSPlayer.Controls.playerWrap.msRequestFullscreen) {
				JSPlayer.Controls.playerWrap.msRequestFullscreen()
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
		JSPlayer.Controls.playerWrap.classList.toggle('theatre-mode-wrap')
		if (JSPlayer.Controls.playerWrap.classList.contains('theatre-mode-wrap')) {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg')
		} else {
			JSPlayer.Helper.toggleSiblingElement(this.theatreBtn, 'svg', true)
		}
	},

	preparePlayerWhenStartPlaying: function () {
		console.log(this.isPreviewPlaying)
		if (this.isPreviewPlaying) {
			this.isPreviewPlaying = false
			JSPlayer.player.muted = false
			JSPlayer.player.currentTime = 0
			JSPlayer.Chapters.chooseActiveChapter()

			JSPlayer.Controls.commentsContainer.style.visibility = 'visible'

			JSPlayer.Controls.playerOverlayStart.style.display = 'none'
			document
				.querySelector('.player-wrap')
				.classList.add('player-overlay-played')
			JSPlayer.Helper.toggleSiblingElement(
				JSPlayer.Controls.playOrPauseBtn,
				'svg'
			)
			JSPlayer.showHideControls()
			JSPlayer.player.play()
		}
		// Generate CTA button
		if (!JSPlayer.CTA.isCTAButtonGenerated) {
			JSPlayer.CTA.generateCTAButton(dataCTA)
			JSPlayer.CTA.isCTAButtonGenerated = true
			this.playerCtaButtonDefault = document.querySelector(
				'.player-cta-button-default'
			)
		}
	},

	initPreviewLoop: function () {
		JSPlayer.player.muted = true

		JSPlayer.player
			.play()
			.then(() => {
				JSPlayer.player.addEventListener('timeupdate', () => {
					if (this.isPreviewPlaying) {
						document.querySelector('#annotation_canvas').classList.add('hide')

						document
							.querySelectorAll('.controls-comments-item')
							.forEach(item => {
								item.classList.remove('active')
							})
						if (JSPlayer.player.currentTime >= this.PREVIEW_DURATION) {
							JSPlayer.player.currentTime = 0
							JSPlayer.Chapters.chooseActiveChapter()
						}
					}
				})
			})
			.catch(error => {
				JSPlayer.player.currentTime = 0
				console.error('Preview autoplay failed:', error)
			})
	},
}
