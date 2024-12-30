JSPlayer.Events = {
	loadedMetaData: function() {
		setTimeout(() => {
			JSPlayer.Settings.hideTextTracks()
		}, 10)
		JSPlayer.Actions.applyTheme({ primary: '#1891ED' })
		duration.innerText = JSPlayer.Helper.formatTime(player.duration)
		showPlayerOverlayTimer.style.display = 'block'
		showPlayerOverlayTimer.querySelector('span').innerText =
			JSPlayer.Helper.formatTime(player.duration, true)
		player.volume = playerVolumeCount

		// Load comments

		JSPlayer.Comments.init(player, commentsContainer, dataChapters)
		JSPlayer.Comments.load(dataComments)

		// overlay player start

		playerOverlayStart.addEventListener('click', preparePlayerWhenStartPlaying)

		JSPlayer.Chapters.init(player)
		JSPlayer.Chapters.load(dataChapters)
		JSPlayer.Comments.add(
			{
				seconds: JSPlayer.Helper.parseToSeconds('17:26'),
				comment: ' Added a comment using the "addComment" method',
			},
			dataComments
		)
	},

	ended: function() {
		const playerCtaButtonDefault = document.querySelector(
			'.player-cta-button-default'
		)
		JSPlayer.showHideControls(true)
		JSPlayer.Controls.commentsContainer.style.visibility = 'hidden'
		JSPlayer.Controls.playerOverlayEnd.style.display = 'flex'
		JSPlayer.Controls.playerCtaButtonDefault.classList.add('hidden')
		JSPlayer.Helper.toggleSiblingElement(playOrPauseBtn, 'svg', true)
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

JSPlayer.Actions = {
	applyTheme: function ({
		primary = JSPlayer.themeColor.primary,
		secondary = JSPlayer.themeColor.secondary,
	}) {
		JSPlayer.themeColor.primary = primary
		JSPlayer.themeColor.secondary = secondary
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
}
