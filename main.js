'use strict'
document.addEventListener('DOMContentLoaded', () => {
	const player = document.getElementById('player')
	const playOrPauseBtn = document.getElementById('play-or-pause')
	const muteBtn = document.getElementById('mute')
	const fullScreenBtn = document.getElementById('fullscreen')
	const volumeSlider = document.getElementById('volume-slider')
	const currentTime = document.getElementById('controls-current-time')
	const duration = document.getElementById('controls-duration')
	let volumeSliderValue = 0.5

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

	function chooseVolume() {
		player.volume = volumeSlider.value
		volumeSliderValue = volumeSlider.value
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
			volumeSlider.value = 0
		} else {
			player.muted = false
			toggleSiblingElement(muteBtn, 'svg', true)
			volumeSlider.value = volumeSliderValue
		}
	}

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60)
		const sec = Math.floor(seconds % 60)
		console.log(minutes)

		return (
			(minutes < 10 ? '0' : '') + minutes + ':' + (sec < 10 ? '0' : '') + sec
		)
	}

	playOrPauseBtn.addEventListener('click', playOrPause)
	muteBtn.addEventListener('click', mute)
	fullScreenBtn.addEventListener('click', toggleFullScreen)
	volumeSlider.addEventListener('input', chooseVolume)
	player.addEventListener('click', playOrPause)
	player.addEventListener('loadedmetadata', () => {
		duration.innerText = formatTime(player.duration)
	})
	player.addEventListener('timeupdate', () => {
		currentTime.innerText = formatTime(player.currentTime)
	})
})
