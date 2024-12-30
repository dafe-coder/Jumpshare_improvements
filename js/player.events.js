JSPlayer.Events = {

	isDragging: null,
	dragType: null,

	init : function() {

		this.isDragging = false
		this.dragType = 'time'

	},

	bootstrap: function() {
		this.init()

		window.addEventListener('mousemove', event => {
			if (JSPlayer.Events.isDragging && JSPlayer.Events.dragType === 'time') {
				JSPlayer.moveSlider(event, JSPlayer.Controls.controlsTimeRail, JSPlayer.Events.dragType)
			} else if (JSPlayer.Events.isDragging && JSPlayer.Events.dragType === 'volume') {
				JSPlayer.moveSlider(event, JSPlayer.Controls.volumeSlider, JSPlayer.Events.dragType)
			}
		})

		window.addEventListener('mouseup', () => {
			JSPlayer.Events.isDragging = false
		})

		window.addEventListener('resize', () => {
			console.log('resize')
			JSPlayer.Events.resizeVideoPlayer()
		})
	},

	loadedMetaData: function() {
		setTimeout(() => {
			JSPlayer.hideTextTracks()
		}, 10)
		JSPlayer.applyTheme({ primary: '#1891ED' })
		JSPlayer.Controls.duration.innerText = JSPlayer.Helper.formatTime(player.duration)
		JSPlayer.Controls.showPlayerOverlayTimer.style.display = 'block'
		JSPlayer.Controls.showPlayerOverlayTimer.querySelector('span').innerText = JSPlayer.Helper.formatTime(player.duration, true)
		JSPlayer.player.volume = JSPlayer.Controls.playerVolumeCount

		// Load comments
		JSPlayer.Comments.init()
		JSPlayer.Comments.load(dataComments)
		
		JSPlayer.Chapters.init()
		JSPlayer.Chapters.load(dataChapters)
		
		JSPlayer.Comments.init()
		JSPlayer.Comments.add(
			{
				seconds: JSPlayer.Helper.parseToSeconds('17:26'),
				comment: ' Added a comment using the "addComment" method',
			}
		)

		// Captions
		JSPlayer.Captions.init()
		JSPlayer.Captions.bootstrap();

		// Generate СTA Button
		JSPlayer.CTA.init()
	},

	ended: function() {
		JSPlayer.showHideControls(true)
		JSPlayer.Controls.commentsContainer.style.visibility = 'hidden'
		JSPlayer.Controls.playerOverlayEnd.style.display = 'flex'
		JSPlayer.Controls.playerCtaButtonDefault.classList.add('hidden')
		JSPlayer.Helper.toggleSiblingElement(JSPlayer.Controls.playOrPauseBtn, 'svg', true)
		JSPlayer.Chapters.activeChapter = 1
	},

	resizeVideoPlayer: function () {
		const playerHeight = JSPlayer.videoSize.split('x')[1]
		const playerWidth = JSPlayer.videoSize.split('x')[0]
		JSPlayer.Controls.playerWrap.style.height =
			(playerHeight / playerWidth) *
			JSPlayer.Controls.playerWrap.getBoundingClientRect().width +
			'px'
	},

	error: function(e) {
		const error = e.target.error || player.error
		if (error) {
			switch (error.code) {
				case 1: // MEDIA_ERR_ABORTED
					console.log('Загрузка прервана')
					break
				case 2: // MEDIA_ERR_NETWORK
					console.log('Сетевая ошибка')
					break
				case 3: // MEDIA_ERR_DECODE
					console.log('Ошибка декодирования')
					break
				case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
					console.log('Формат не поддерживается')
					break
				default:
					console.log('Неизвестная ошибка')
			}
			console.log('Детали ошибки:', error.message)
		} else {
			console.log('Error object is not available')
			console.log('Event target:', e.target)
			console.log('Player source:', player.currentSrc)
		}
	}
}
