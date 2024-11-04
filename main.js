'use strict'
document.addEventListener('DOMContentLoaded', () => {
	const player = document.getElementById('player')
	const playOrPauseBtn = document.getElementById('play-or-pause')
	const muteBtn = document.getElementById('mute')
	const fullScreenBtn = document.getElementById('fullscreen')
	const currentTime = document.getElementById('controls-current-time')
	const duration = document.getElementById('controls-duration')
	const playbackRate = document.getElementById('playback-rate')
	const showPlayerOverlayTimer = document.querySelector(
		'.show-player-timer span'
	)

	let playerVolumeCount = 0.5

	function toggleSiblingElement(parentElement, element, showFirst = false) {
		if (showFirst) {
			parentElement.querySelector(`${element}:first-child`).style.display =
				'block'
			parentElement.querySelector(`${element}:last-child`).style.display =
				'none'
		} else {
			parentElement.querySelector(`${element}:first-child`).style.display =
				'none'
			parentElement.querySelector(`${element}:last-child`).style.display =
				'block'
		}
	}

	function toggleFullScreen() {
		if (player.requestFullscreen) {
			player.requestFullscreen()
		} else if (player.webkitRequestFullscreen) {
			/* Safari */
			player.webkitRequestFullscreen()
		} else if (player.msRequestFullscreen) {
			/* IE11 */
			player.msRequestFullscreen()
		}
	}

	function playOrPause() {
		const playCircle = document.querySelector('.play-circle')
		let timerId = null

		if (player.paused) {
			player.play()
			toggleSiblingElement(playOrPauseBtn, 'svg')
			toggleSiblingElement(playCircle, 'svg', true)
			playCircle.style.transform = 'translate(-50%, -50%) scale(1.7)'
			playCircle.style.opacity = '1'
			timerId = setTimeout(() => {
				playCircle.style.opacity = '0'
				playCircle.style.transform = 'translate(-50%, -50%) scale(1.2)'
				clearTimeout(timerId)
			}, 300)
		} else {
			player.pause()
			toggleSiblingElement(playOrPauseBtn, 'svg', true)
			toggleSiblingElement(playCircle, 'svg')
			playCircle.style.transform = 'translate(-50%, -50%) scale(1.7)'
			playCircle.style.opacity = '1'

			timerId = setTimeout(() => {
				playCircle.style.opacity = '0'
				playCircle.style.transform = 'translate(-50%, -50%) scale(1.2)'
				clearTimeout(timerId)
			}, 300)
		}
	}

	function mute() {
		if (!player.muted) {
			player.muted = true
			toggleSiblingElement(muteBtn, 'svg')
			updateProgressVolume(0)
		} else {
			player.muted = false
			toggleSiblingElement(muteBtn, 'svg', true)
			updateProgressVolume(playerVolumeCount)
		}
	}

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60)
		const sec = Math.floor(seconds % 60)
		return (
			(minutes < 10 ? '0' : '') + minutes + ':' + (sec < 10 ? '0' : '') + sec
		)
	}

	function choosePlaybackRate() {
		const playbackRateCount = playbackRate.querySelector('.playback-rate-count')

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
	}

	playOrPauseBtn.addEventListener('click', playOrPause)
	muteBtn.addEventListener('click', mute)
	fullScreenBtn.addEventListener('click', toggleFullScreen)
	playbackRate.addEventListener('click', choosePlaybackRate)
	player.addEventListener('click', playOrPause)
	player.addEventListener('loadedmetadata', () => {
		duration.innerText = formatTime(player.duration)
		showPlayerOverlayTimer.innerText = Math.floor(player.duration)
		player.volume = playerVolumeCount

		// overlay player
		const playerOverlayStart = document.querySelector('.player-overlay-start')

		playerOverlayStart.addEventListener('click', () => {
			player.play()
			playerOverlayStart.style.display = 'none'
			document
				.querySelector('.player-wrap')
				.classList.add('player-overlay-played')
			toggleSiblingElement(playOrPauseBtn, 'svg')
		})
	})

	// Slider player (time rail)
	const controlsTimeRail = document.getElementById('controls-time-rail')
	const sliderProgress = document.getElementById('slider-progress')
	const sliderThumb = document.getElementById('slider-thumb')
	let isDragging = false
	let isDraggingType = 'time'

	function updateSlider() {
		const progressPercent = (player.currentTime / player.duration) * 100
		sliderProgress.style.width = progressPercent + '%'
		sliderThumb.style.left = progressPercent + '%'
		currentTime.innerHTML = formatTime(player.currentTime)
	}

	function moveSlider(event, elem) {
		const rect = elem.getBoundingClientRect()
		if (rect.width > 0) {
			const offsetX = event.clientX - rect.left
			const width = rect.width
			const percentage = offsetX / width

			if (isDraggingType === 'time') {
				const newTime = player.duration * percentage
				player.currentTime = newTime
				updateSlider()
			}
			if (isDraggingType === 'volume' && percentage >= 0 && percentage <= 1) {
				if (percentage === 0) {
					toggleSiblingElement(muteBtn, 'svg')
				} else {
					toggleSiblingElement(muteBtn, 'svg', true)
				}
				playerVolumeCount = percentage
				player.volume = percentage
				updateProgressVolume(percentage)
			}
		}
	}

	controlsTimeRail.addEventListener('mousedown', event => {
		isDragging = true
		isDraggingType = 'time'
		moveSlider(event, controlsTimeRail, isDraggingType)
	})

	player.addEventListener('timeupdate', () => {
		currentTime.innerText = formatTime(player.currentTime)
		updateSlider()
	})

	// Volume slider

	const volumeSlider = document.getElementById('volume-slider')

	function updateProgressVolume(percentage) {
		const progressPercent = percentage * 100
		volumeSlider.querySelector('.volume-slider-progress').style.width =
			progressPercent + '%'
	}

	volumeSlider.addEventListener('mousedown', event => {
		isDragging = true
		isDraggingType = 'volume'
		moveSlider(event, volumeSlider, isDraggingType)
	})

	window.addEventListener('mousemove', event => {
		if (isDragging && isDraggingType === 'time') {
			moveSlider(event, controlsTimeRail)
		} else if (isDragging && isDraggingType === 'volume') {
			moveSlider(event, volumeSlider)
		}
	})
	window.addEventListener('mouseup', () => {
		isDragging = false
	})

	// When the video ends
	const playerOverlayEnd = document.querySelector('.player-overlay-end')
	const playerOverlayBtnEnd = document.querySelector(
		'.player-overlay-button-end'
	)

	player.addEventListener('ended', () => {
		playerOverlayEnd.style.display = 'flex'
	})

	playerOverlayBtnEnd.addEventListener('click', () => {
		player.currentTime = 0
		player.play()
		playerOverlayEnd.style.display = 'none'
	})

	// Theatre mode
	const theatreBtn = document.getElementById('theatre-mode')
	theatreBtn.addEventListener('click', () => {
		const playerWrap = document.querySelector('.player-wrap')
		playerWrap.classList.toggle('theatre-mode-wrap')
		if (playerWrap.classList.contains('theatre-mode-wrap')) {
			toggleSiblingElement(theatreBtn, 'svg')
		} else {
			toggleSiblingElement(theatreBtn, 'svg', true)
		}
	})
})
