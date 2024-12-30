JSPlayer.Chapters = {
	data: null,
	activeChapter: 1,
	activeChapterTitle: null,

	init: function () {
		this.activeChapterTitle = document.querySelector(
			'.controls-active-chapter-title'
		)
	},
	load: function (dataChapters) {
		if (!dataChapters?.chapters?.length) return

		this.data = dataChapters

		const chaptersMenu = document.querySelector('.video_chapters')
		const chapterSliderItems = document.querySelector('.chapter-slider-items')

		chaptersMenu.addEventListener('click', e => {
			if (e.target.tagName === 'A') {
				JSPlayer.player.currentTime = Number(e.target.dataset.chapterstamp)
				this.chooseActiveChapter()
			}
		})

		this.data.chapters.forEach((chapter, i) => {
			const chapterStart = chapter.line
			const chapterEnd =
				this.data.chapters[i + 1]?.line ?? JSPlayer.player.duration

			chaptersMenu.innerHTML += this.createButton(
				chapter,
				chapterStart,
				chapterEnd
			)

			const { item, titleElement } = this.createSliderItem(
				chapter,
				chapterStart,
				chapterEnd
			)
			chapterSliderItems.appendChild(item)

			requestAnimationFrame(() => {
				const rect = titleElement.getBoundingClientRect()
				const playerPos = JSPlayer.player.getBoundingClientRect()
				const relativePosition = {
					top: rect.top - playerPos.top,
					left: rect.left - playerPos.left,
				}

				if (rect.width + relativePosition.left > playerPos.width) {
					titleElement.style.left = 'auto'
					titleElement.style.right =
						i === this.data.chapters.length - 1 ? '10px' : '0'
				}
			})
		})
	},

	createButton: function (chapter, chapterStart, chapterEnd) {
		return `<li>
			<a href="javascript:;" 
			   data-chapterstamp="${chapterStart}"
			   data-chapterstampend="${chapterEnd}"
			>${JSPlayer.Helper.formatTime(chapterStart)}</a
			>${chapter.name}
		</li>`
	},

	createSliderItem: function (chapter, chapterStart, chapterEnd) {
		const width =
			((chapterEnd - chapterStart) / JSPlayer.player.duration) * 100
		const item = document.createElement('span')
		item.classList.add('chapter-slider-item')
		item.dataset.dataSliderStartTime = chapterStart
		item.dataset.dataSliderEndTime = chapterEnd
		item.style.width = `${width}%`

		const elements = [
			['chapter-slider-title', chapter.name],
			['chapter-slider-loading', ''],
			['chapter-slider-progress', ''],
			['chapter-slider-bg', ''],
		].map(([className, text]) => {
			const el = document.createElement('span')
			el.classList.add(className)
			if (className === 'chapter-slider-progress') {
				el.style.backgroundColor = JSPlayer.themeColor.primary
			}
			if (className === 'chapter-slider-bg') {
				el.style.backgroundColor = JSPlayer.themeColor.secondary
			}
			if (text) el.textContent = text
			return el
		})

		elements.forEach(el => item.appendChild(el))
		return { item, titleElement: elements[0] }
	},

	chooseActiveChapter: function () {
		this.data.chapters.forEach((item, idx) => {
			const start = item.line
			const end = this.data.chapters[idx + 1]
				? this.data.chapters[idx + 1].line
				: JSPlayer.player.duration
			if (JSPlayer.player.currentTime >= start && JSPlayer.player.currentTime <= end) {
				this.activeChapter = idx + 1
			}
		})
	},

	updateActiveChapterTitle: function () {
		if (!JSPlayer.Chapters.data?.chapters?.length) return
		this.activeChapterTitle.querySelector('span').innerText =
		JSPlayer.Chapters.data.chapters[JSPlayer.Chapters.activeChapter - 1].name
	},
}
