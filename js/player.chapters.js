JSPlayer.Chapters = {
	data: null,
	player: null,
	activeChapter: 1,
	activeChapterTitle: null,

	init: function (playerObj) {
		this.player = playerObj
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
				this.player.currentTime = Number(e.target.dataset.chapterstamp)
				this.chooseActiveChapter()
			}
		})

		this.data.chapters.forEach((chapter, i) => {
			const chapterStart = chapter.M.line.S
			const chapterEnd =
				this.data.chapters[i + 1]?.M.line.S ?? this.player.duration

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
				const playerPos = this.player.getBoundingClientRect()
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
			>${chapter.M.name.S}
		</li>`
	},

	createSliderItem: function (chapter, chapterStart, chapterEnd) {
		const width =
			((chapterEnd - chapterStart) / JSPlayer.Chapters.player.duration) * 100
		const item = document.createElement('span')
		item.classList.add('chapter-slider-item')
		item.dataset.dataSliderStartTime = chapterStart
		item.dataset.dataSliderEndTime = chapterEnd
		item.style.width = `${width}%`

		const elements = [
			['chapter-slider-title', chapter.M.name.S],
			['chapter-slider-loading', ''],
			['chapter-slider-progress', ''],
			['chapter-slider-bg', ''],
		].map(([className, text]) => {
			const el = document.createElement('span')
			el.classList.add(className)
			if (className === 'chapter-slider-progress') {
				el.style.backgroundColor = JSPlayer.Settings.themeColor.primary
			}
			if (className === 'chapter-slider-bg') {
				el.style.backgroundColor = JSPlayer.Settings.themeColor.secondary
			}
			if (text) el.textContent = text
			return el
		})

		elements.forEach(el => item.appendChild(el))
		return { item, titleElement: elements[0] }
	},

	chooseActiveChapter: function () {
		this.data.chapters.forEach((item, idx) => {
			const start = item.M.line.S
			const end = this.data.chapters[idx + 1]
				? this.data.chapters[idx + 1].M.line.S
				: this.player.duration
			if (this.player.currentTime >= start && this.player.currentTime <= end) {
				this.activeChapter = idx + 1
			}
		})
	},

	updateActiveChapterTitle: function (dataChapters) {
		if (!dataChapters?.chapters?.length) return
		this.activeChapterTitle.querySelector('span').innerText =
			dataChapters.chapters[JSPlayer.Chapters.activeChapter - 1].M.name.S
	},
}
