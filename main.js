'use strict'
document.addEventListener('DOMContentLoaded', () => {
	const player = document.getElementById('player')
	const playOrPauseBtn = document.getElementById('play-or-pause')
	const muteBtn = document.getElementById('mute')
	const fullScreenBtn = document.getElementById('fullscreen')

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
		if (player.paused) {
			player.play()
			toggleSiblingElement(playOrPauseBtn, 'svg')
		} else {
			player.pause()
			toggleSiblingElement(playOrPauseBtn, 'svg', true)
		}
	}

	function mute() {
		if (!player.muted) {
			player.muted = true
			toggleSiblingElement(muteBtn, 'svg')
		} else {
			player.muted = false
			toggleSiblingElement(muteBtn, 'svg', true)
		}
	}

	playOrPauseBtn.addEventListener('click', playOrPause)
	muteBtn.addEventListener('click', mute)
	fullScreenBtn.addEventListener('click', toggleFullScreen)
	player.addEventListener('click', playOrPause)
})
