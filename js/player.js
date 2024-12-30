const JSPlayer = {
	player: null,
	videoSize: '640x360',

	themeColor: {
		primary: '#1891ED',
		secondary: 'rgba(255, 255, 255, 0.5)',
	},

	annotation: {
		annotation_json:
			'[{"color":"#F73D72","id":"0","type":"rectangle","x1":"49.19","y1":"20.98","x2":"82.96","y2":"77.73"}]',
	},
		
	init: function (player) {
		this.player = player;
	},

	bootstrap: function () {
		this.addEventListeners();
	},

	addEventListeners: function () {
		//  On loading
		this.player.addEventListener('waiting', () => {
			JSPlayer.Controls.loadingBgSpinner.style.display = 'block'
		})
		this.player.addEventListener('canplay', () => {
			JSPlayer.Controls.loadingBgSpinner.style.display = 'none'
		})
		this.player.addEventListener('playing', () => {
			JSPlayer.Controls.loadingBgSpinner.style.display = 'none'
		})

		// Handle progress Video
		this.player.addEventListener('progress', () => JSPlayer.handleProgress())
		this.player.addEventListener('loadeddata', () => JSPlayer.handleProgress())

		// Handle controls
		controls.addEventListener('mousemove', () => {
			JSPlayer.showHideControls()
			clearTimeout(JSPlayer.Controls.playerControlsTimeout)
		})
		this.player.addEventListener('mousemove', e =>
			JSPlayer.hideShowControlsOnHover(e)
		)
		JSPlayer.Controls.playerWrap.addEventListener('mouseleave', () => {
			if (!JSPlayer.player.paused) {
				JSPlayer.showHideControls(true)
			}
		})

		
		this.player.addEventListener('click', e => JSPlayer.playOrPause(e))

		this.player.addEventListener('loadedmetadata', JSPlayer.Events.loadedMetaData )


		this.player.addEventListener('ended', JSPlayer.Events.ended)

		// Errors
		this.player.addEventListener('error', e => {
			console.log('Video Error Event:', e)
			JSPlayer.Events.error(e)
		})
	},

	resizeVideoPlayerTheatreMode: function () {
		theatreModeID = setTimeout(() => {
			const playerHeight = JSPlayer.videoSize.split('x')[1]
			const playerWidth = JSPlayer.videoSize.split('x')[0]
			const aspectRatio = playerWidth / playerHeight

			const wrapHeight = JSPlayer.playerWrap.getBoundingClientRect().height
			const calculatedWidth = wrapHeight * aspectRatio

			JSPlayer.player.style.height = wrapHeight + 'px'
			JSPlayer.player.style.width = calculatedWidth + 'px'

			JSPlayer.player.style.margin = '0 auto'

			document.querySelector('#annotation_canvas').style.height =
				wrapHeight + 'px'
			document.querySelector('#annotation_canvas').style.width =
				calculatedWidth + 'px'
			document.querySelector('#annotation_canvas').style.margin = '0 auto'
		}, 10)
	},

	choosePlaybackRate: function () {
		const playbackRateCount = JSPlayer.playbackRate.querySelector(
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
				const newTime = JSPlayer.player.duration * percentage
				JSPlayer.player.currentTime = newTime
				JSPlayer.Chapters.chooseActiveChapter()
				this.updateSlider(this.dataChapters)
			}
			if (isDraggingType === 'volume' && percentage >= 0 && percentage <= 1) {
				if (percentage === 0) {
					JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg')
				} else {
					JSPlayer.Helper.toggleSiblingElement(this.muteBtn, 'svg', true)
				}
				JSPlayer.Controls.updateVolumeCount(percentage)
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
			this.player.currentTime
		)
		document.querySelector('.comment-new-timestamp').innerText =
			JSPlayer.Helper.formatTime(this.player.currentTime)
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
			clearTimeout(JSPlayer.Controls.playerControlsTimeout)
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
			clearTimeout(JSPlayer.Controls.playerControlsTimeout)
			JSPlayer.Controls.playerControlsTimeout = setTimeout(() => {
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
		const buffered = this.player.buffered
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
	}
	
}
