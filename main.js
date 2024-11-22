'use strict'
const dataChapters = {
	chapters: [
		{
			M: {
				name: {
					S: 'Foundations of Video Editing',
				},
				line: {
					S: '0',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Organizing Your Workflow',
				},
				line: {
					S: '10',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Utilizing External Drives for Storage',
				},
				line: {
					S: '14',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Choosing the Right Editing Software',
				},
				line: {
					S: '25',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Trimming and Editing Process',
				},
				line: {
					S: '40',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Incorporating B-roll and Stock Footage',
				},
				line: {
					S: '45',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Adding Text and Templates',
				},
				line: {
					S: '50',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Reviewing and Finalizing the Edit',
				},
				line: {
					S: '51',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Rendering and Uploading with Camtasia',
				},
				line: {
					S: '52',
				},
			},
		},
		{
			M: {
				name: {
					S: 'Continuous Improvement in Editing',
				},
				line: {
					S: '55',
				},
			},
		},
	],
}

document.addEventListener('DOMContentLoaded', () => {
	const player = document.getElementById('player')
	const playOrPauseBtn = document.getElementById('play-or-pause')
	const muteBtn = document.getElementById('mute')
	const currentTime = document.getElementById('controls-current-time')
	const duration = document.getElementById('controls-duration')
	const playbackRate = document.getElementById('playback-rate')
	const showPlayerOverlayTimer = document.querySelector(
		'.show-player-timer span'
	)
	const controls = document.querySelector('.controls')
	let controlsShowID = null
	// Hide native controls
	player.controls = false

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

	function hideShowControlsOnHover() {
		if (!player.paused) {
			controls.classList.add('active')
			clearTimeout(controlsShowID)
			controlsShowID = setTimeout(() => {
				controls.classList.remove('active')
			}, 4000)
		}
	}

	player.addEventListener('mousemove', hideShowControlsOnHover)

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
			hideShowControlsOnHover()
		} else {
			player.pause()
			clearTimeout(controlsShowID)
			controls.classList.add('active')
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

	function formatTime(seconds, named = false) {
		const minutes = Math.floor(seconds / 60)
		const sec = Math.floor(seconds % 60)
		if (!named) {
			return (
				(minutes < 10 ? '0' : '') + minutes + ':' + (sec < 10 ? '0' : '') + sec
			)
		} else {
			return (
				(minutes < 10 && minutes > 0 ? '0' : '') +
				(minutes > 0 ? minutes : '') +
				(minutes > 0 ? ' min ' : '') +
				(sec < 10 ? '0' : '') +
				(sec + ' sec')
			)
		}
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
	playbackRate.addEventListener('click', choosePlaybackRate)
	player.addEventListener('click', playOrPause)
	function hideTextTracks() {
		for (let i = 0; i < player.textTracks.length; i++) {
			player.textTracks[i].mode = 'hidden'
		}
	}
	hideTextTracks()
	player.addEventListener('loadedmetadata', () => {
		setTimeout(() => {
			hideTextTracks()
		}, 10)
		duration.innerText = formatTime(player.duration)
		showPlayerOverlayTimer.innerText = formatTime(player.duration, true)
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
			controls.classList.add('active')
		})

		loadChapters()
	})

	// Slider player (time rail)
	const controlsTimeRail = document.getElementById('controls-time-rail')
	const sliderRail = document.getElementById('controls-time-rail')
	const sliderThumb = document.getElementById('slider-thumb')
	let isDragging = false
	let isDraggingType = 'time'
	let activeChapter = 1

	function chooseActiveChapter() {
		dataChapters.chapters.forEach((item, idx) => {
			const start = item.M.line.S
			const end = dataChapters.chapters[idx + 1]
				? dataChapters.chapters[idx + 1].M.line.S
				: player.duration
			if (player.currentTime >= start && player.currentTime <= end) {
				activeChapter = idx + 1
			}
		})
	}

	function updateSlider() {
		const startValue = dataChapters.chapters[activeChapter - 1].M.line.S
		const endValue = dataChapters.chapters[activeChapter]
			? dataChapters.chapters[activeChapter].M.line.S
			: player.duration
		const progressRailPercent =
			((player.currentTime - startValue) / (endValue - startValue)) * 100
		const progressThumbPercent = (player.currentTime / player.duration) * 100

		const sliderRailItemsProgress = sliderRail.querySelectorAll(
			'.chapter-slider-progress'
		)

		sliderRailItemsProgress.forEach((item, idx) => {
			if (idx < activeChapter - 1) {
				item.style.width = '100%'
			} else {
				item.style.width = 0
			}
		})

		sliderThumb.style.left = progressThumbPercent + '%'

		if (progressRailPercent <= 99.99) {
			sliderRailItemsProgress[activeChapter - 1].style.width =
				progressRailPercent + '%'
		} else {
			sliderRailItemsProgress[activeChapter - 1].style.width = '100%'
			++activeChapter
		}
		currentTime.innerHTML = formatTime(player.currentTime)
	}

	function moveSlider(event, elem) {
		const rect = elem.getBoundingClientRect()
		if (rect.width > 0) {
			const offsetX = event.clientX - rect.left
			const width = rect.width
			const percentage = offsetX / width

			if (isDraggingType === 'time' && percentage >= 0 && percentage <= 0.99) {
				const newTime = player.duration * percentage
				player.currentTime = newTime
				chooseActiveChapter()
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
		toggleSiblingElement(playOrPauseBtn, 'svg', true)
		activeChapter = 1
	})

	playerOverlayBtnEnd.addEventListener('click', () => {
		player.currentTime = 0
		player.play()
		playerOverlayEnd.style.display = 'none'
		toggleSiblingElement(playOrPauseBtn, 'svg')
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

	// Fullscreen
	const fullScreenBtn = document.getElementById('fullscreen')

	fullScreenBtn.addEventListener('click', toggleFullScreen)

	function toggleFullScreen() {
		const playerWrap = document.querySelector('.player-wrap')
		if (!document.fullscreenElement) {
			if (playerWrap.requestFullscreen) {
				playerWrap.requestFullscreen()
			} else if (playerWrap.webkitRequestFullscreen) {
				playerWrap.webkitRequestFullscreen()
			} else if (playerWrap.msRequestFullscreen) {
				playerWrap.msRequestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			} else if (document.msExitFullscreen) {
			}
		}
	}

	const toggleFullscreenStyles = e => {
		e.preventDefault()

		const isFullscreen = !!document.fullscreenElement
		if (isFullscreen) {
			setTimeout(() => {
				document.querySelector('.controls').style.position = 'fixed'
			}, 0)
		} else {
			document.querySelector('.controls').style.position = 'absolute'
		}
	}

	document.addEventListener('fullscreenchange', toggleFullscreenStyles)
	document.addEventListener('webkitfullscreenchange', toggleFullscreenStyles)
	document.addEventListener('mozfullscreenchange', toggleFullscreenStyles)

	// Keyboard
	document.addEventListener('keydown', e => {
		const skipAmount = 10
		if (player.currentTime > 0) {
			if (e.code === 'Space') {
				e.preventDefault()
				if (player.paused || player.ended) {
					player.play()
					toggleSiblingElement(playOrPauseBtn, 'svg')
				} else {
					player.pause()
					toggleSiblingElement(playOrPauseBtn, 'svg', true)
				}
			}
			if (e.code === 'ArrowLeft') {
				player.currentTime -= skipAmount
			}
			if (e.code === 'ArrowRight') {
				player.currentTime += skipAmount
			}
			if (e.code === 'KeyK') {
				toggleFullScreen()
			}
		}
	})

	//  On loading
	const loadingImg = document.querySelector('.loading-bg-img')
	player.addEventListener('waiting', () => {
		loadingImg.style.display = 'block'
	})
	player.addEventListener('canplay', () => {
		loadingImg.style.display = 'none'
	})
	player.addEventListener('playing', () => {
		loadingImg.style.display = 'none'
	})

	// Captions
	const captionTrack = document.getElementById('captions-track')
	const captionBtn = document.getElementById('captions-btn')
	const customCaptions = document.querySelector('.custom-captions')
	let isShowCaptions = false
	let activeCuesLength = 0
	customCaptions.style.display = 'none'

	captionBtn.addEventListener('click', () => {
		if (isShowCaptions) {
			isShowCaptions = false
			customCaptions.style.display = 'none'
			toggleSiblingElement(captionBtn, 'svg', true)
		} else {
			if (activeCuesLength > 0) {
				customCaptions.style.display = 'block'
			} else {
				customCaptions.style.display = 'none'
			}
			isShowCaptions = true
			toggleSiblingElement(captionBtn, 'svg')
		}
	})

	function showCaptions(text) {
		if (text) {
			customCaptions.innerText = text
		}

		customCaptions.style.display = 'block'
	}

	function hideCaptions(text) {
		if (text) {
			customCaptions.innerText = text
		}
		customCaptions.style.display = 'none'
	}

	captionTrack.addEventListener('cuechange', () => {
		const activeCues = player.textTracks[0].activeCues
		activeCuesLength = activeCues.length

		if (isShowCaptions && activeCues.length > 0) {
			showCaptions(activeCues[0].text)
		} else {
			hideCaptions(activeCues.length > 0 && activeCues[0].text)
		}
	})

	function loadChapters() {
		if (dataChapters.chapters && dataChapters.chapters.length > 0) {
			const chaptersMenu = document.querySelector('.video_chapters')
			const chapterSliderItems = document.querySelector('.chapter-slider-items')

			for (let i = 0; i < dataChapters.chapters.length; i++) {
				const chapter = dataChapters.chapters[i]
				const chapterStart = chapter.M.line.S
				const chapterEnd = dataChapters.chapters[i + 1]
					? dataChapters.chapters[i + 1].M.line.S
					: player.duration
				const chapterTitle = chapter.M.name.S

				const chapterButton = `<li>
								<a
									href="javascript:;"
									data-chapterstamp="${chapterStart}"
									data-chapterstampend="${chapterEnd}"
									data-chapterstamp2="0"
									data-chapterstamp2end="3.14"
									>${formatTime(chapterStart)}</a
								>${chapterTitle}
							</li>`

				chaptersMenu.addEventListener('click', e => {
					if (e.target.tagName === 'A') {
						chooseActiveChapter()
						player.currentTime = e.target.dataset.chapterstamp
					}
				})

				const widthChapterSliderItem =
					((chapterEnd - chapterStart) / player.duration) * 100
				const chapterSliderItem = document.createElement('span')
				chapterSliderItem.classList.add('chapter-slider-item')
				chapterSliderItem.style.width = `${widthChapterSliderItem}%`

				// Создаем элементы отдельно
				const chapterTitleElement = document.createElement('span')
				chapterTitleElement.classList.add('chapter-slider-title')
				chapterTitleElement.textContent = chapterTitle

				const chapterLoadingElement = document.createElement('span')
				chapterLoadingElement.classList.add('chapter-slider-loading')

				const chapterProgressElement = document.createElement('span')
				chapterProgressElement.classList.add('chapter-slider-progress')

				const chapterBgElement = document.createElement('span')
				chapterBgElement.classList.add('chapter-slider-bg')

				chapterSliderItem.appendChild(chapterTitleElement)
				chapterSliderItem.appendChild(chapterLoadingElement)
				chapterSliderItem.appendChild(chapterProgressElement)
				chapterSliderItem.appendChild(chapterBgElement)

				chapterSliderItem.addEventListener('mouseenter', () => {
					console.log('mouseenter')

					const spanTitle = chapterSliderItem.querySelector(
						'.chapter-slider-title'
					)
					const rect = spanTitle.getBoundingClientRect()
					const playerPos = player.getBoundingClientRect()
					const relativePosition = {
						top: rect.top - playerPos.top,
						left: rect.left - playerPos.left,
					}
					if (
						rect.width + relativePosition.left >
						player.getBoundingClientRect().width
					) {
						spanTitle.style.left = 'auto'
						spanTitle.style.right = '0'
						if (i == dataChapters.chapters.length - 1) {
							spanTitle.style.right = '10px'
						}
					}
				})

				chaptersMenu.innerHTML += chapterButton
				chapterSliderItems.appendChild(chapterSliderItem)
			}
		}
	}
})
