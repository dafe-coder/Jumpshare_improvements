const JSPlayer = {
	Settings: {
		player: null,
		playerWrap: null,

		init: function (player, sliderThumb, playerWrap) {
			this.sliderThumb = sliderThumb
			this.player = player
			this.playerWrap = playerWrap
			this.playbackRate = document.getElementById('playback-rate')
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

		resizeVideoPlayer: function () {
			const playerHeight = JSPlayer.Settings.videoSize.split('x')[1]
			const playerWidth = JSPlayer.Settings.videoSize.split('x')[0]
			console.log(playerHeight, playerWidth)
			this.playerWrap.style.height =
				(playerHeight / playerWidth) *
					this.playerWrap.getBoundingClientRect().width +
				'px'
		},

		choosePlaybackRate: function () {
			const playbackRateCount = this.playbackRate.querySelector(
				'.playback-rate-count'
			)

			switch (playbackRateCount.innerText) {
				case '1':
					playbackRateCount.innerText = 1.25
					player.playbackRate = 1.25
					break
				case '1.25':
					playbackRateCount.innerText = 1.5
					player.playbackRate = 1.25
					break
				case '1.5':
					playbackRateCount.innerText = 1.75
					player.playbackRate = 1.75
					break
				case '1.75':
					playbackRateCount.innerText = 2
					player.playbackRate = 2
					break
				case '2':
					playbackRateCount.innerText = 2.5
					player.playbackRate = 2.5
					break
				case '2.5':
					playbackRateCount.innerText = 0.5
					player.playbackRate = 0.5
					break
				default:
					playbackRateCount.innerText = 1
					player.playbackRate = 1
					break
			}
		},
	},
	Utils: {
		player: null,
		playerWrap: null,
		sliderThumb: null,
		sliderRail: null,
		controlsShowID: null,
		controls: null,
		muteBtn: null,

		init: function ({
			player,
			playerWrap,
			sliderThumb,
			sliderRail,
			controlsShowID,
			currentTime,
			controls,
			playOrPauseBtn,
			playerVolumeCount,
			dataChapters,
			muteBtn,
		} = data) {
			this.sliderThumb = sliderThumb
			this.player = player
			this.playerWrap = playerWrap
			this.sliderRail = sliderRail
			this.controlsShowID = controlsShowID
			this.controls = controls
			this.currentTime = currentTime
			this.playOrPauseBtn = playOrPauseBtn
			this.playerVolumeCount = playerVolumeCount
			this.dataChapters = dataChapters
			this.muteBtn = muteBtn
		},

		moveSlider: function (event, elem, isDraggingType) {
			const rect = elem.getBoundingClientRect()
			if (rect.width > 0) {
				const offsetX = event.clientX - rect.left
				const width = rect.width
				const percentage = offsetX / width

				if (
					isDraggingType === 'time' &&
					percentage >= 0 &&
					percentage <= 0.99
				) {
					const newTime = this.player.duration * percentage
					this.player.currentTime = newTime
					JSPlayer.Chapters.chooseActiveChapter()
					this.updateSlider(this.dataChapters)
				}
				if (isDraggingType === 'volume' && percentage >= 0 && percentage <= 1) {
					if (percentage === 0) {
						JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg')
					} else {
						JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg', true)
					}
					this.playerVolumeCount = percentage
					this.player.volume = percentage
					JSPlayer.Controls.updateProgressVolume(percentage)
				}
			}
		},

		updateSlider: function (dataChapters) {
			const startValue =
				dataChapters.chapters[JSPlayer.Chapters.activeChapter - 1].M.line.S
			const endValue = dataChapters.chapters[JSPlayer.Chapters.activeChapter]
				? dataChapters.chapters[JSPlayer.Chapters.activeChapter].M.line.S
				: this.player.duration
			const progressRailPercent =
				((this.player.currentTime - startValue) / (endValue - startValue)) * 100
			const progressThumbPercent =
				(this.player.currentTime / this.player.duration) * 100

			const sliderRailItemsProgress = this.sliderRail.querySelectorAll(
				'.chapter-slider-progress'
			)

			sliderRailItemsProgress.forEach((item, idx) => {
				if (idx < JSPlayer.Chapters.activeChapter - 1) {
					item.style.width = '100%'
				} else {
					item.style.width = 0
				}
			})

			this.sliderThumb.style.left = progressThumbPercent + '%'

			if (progressRailPercent <= 99.99) {
				sliderRailItemsProgress[
					JSPlayer.Chapters.activeChapter - 1
				].style.width = progressRailPercent + '%'
			} else {
				sliderRailItemsProgress[
					JSPlayer.Chapters.activeChapter - 1
				].style.width = '100%'
				++JSPlayer.Chapters.activeChapter
			}
			this.currentTime.innerHTML = JSPlayer.Helper.formatTime(
				player.currentTime
			)
			document.querySelector('.comment-new-timestamp').innerText =
				JSPlayer.Helper.formatTime(player.currentTime)
		},

		playOrPause: function (e) {
			const playCircle = document.querySelector('.play-circle')
			let timerId = null

			if (this.player.paused) {
				this.player.play()
				JSPlayer.Helper.toggleSiblingElement(this.playOrPauseBtn, 'svg')
				JSPlayer.Helper.toggleSiblingElement(playCircle, 'svg', true)
				playCircle.querySelector('svg').style.animation =
					'playAnim 0.4s ease-in-out'
				timerId = setTimeout(() => {
					playCircle.querySelector('svg').style.animation = ''
				}, 300)
				this.hideShowControlsOnHover(e)
			} else {
				this.player.pause()
				clearTimeout(this.controlsShowID)
				this.showHideControls()
				JSPlayer.Helper.toggleSiblingElement(this.playOrPauseBtn, 'svg', true)
				JSPlayer.Helper.toggleSiblingElement(playCircle, 'svg')
				playCircle.querySelector('svg:last-child').style.animation =
					'playAnim 0.4s ease-in-out'
				timerId = setTimeout(() => {
					playCircle.querySelector('svg:last-child').style.animation = ''
				}, 300)
			}
			clearTimeout(timerId)
		},

		hideShowControlsOnHover: function (e) {
			if (!this.player.paused && e && e.target && e.target !== this.controls) {
				this.showHideControls()
				clearTimeout(this.controlsShowID)
				this.controlsShowID = setTimeout(() => {
					this.showHideControls(true)
				}, 4000)
			}
		},

		showHideControls: function (hide = false) {
			if (!hide) {
				this.controls.classList.add('active')
			} else {
				this.controls.classList.remove('active')
			}
		},

		handleProgress: function () {
			const buffered = player.buffered
			const chapterSliderItems = document.querySelectorAll(
				'.chapter-slider-item'
			)
			if (buffered.length > 0 && chapterSliderItems) {
				const loaded = buffered.end(buffered.length - 1)

				chapterSliderItems.forEach(item => {
					const progressItem = item.querySelector('.chapter-slider-loading')
					if (
						item.dataset.dataSliderEndTime >= loaded &&
						item.dataset.dataSliderStartTime <= loaded
					) {
						const total = item.dataset.dataSliderEndTime
						const progress = (loaded / total) * 100
						progressItem.style.width = `${progress}%`
					} else if (item.dataset.dataSliderEndTime <= loaded) {
						progressItem.style.width = '100%'
					}
				})
			}
		},
	},
}
