JSPlayer.Captions = {
	customCaptions: null,
	captionBtn: null,
	isShowCaptions: false,
	activeCuesLength: 0,

	init: function () {
		this.captionTrack = document.getElementById('captions-track')
		this.captionBtn = document.getElementById('captions-btn')
		this.customCaptions = document.querySelector('.custom-captions')

		this.customCaptions.style.display = 'none'
	},

	bootstrap: function () {
		this.addEventListeners()
	},

	addEventListeners: function () {
		this.captionBtn.addEventListener('click', () => {
			if (JSPlayer.Captions.isShowCaptions) {
				JSPlayer.Captions.isShowCaptions = false
				JSPlayer.Captions.customCaptions.style.display = 'none'
				JSPlayer.Helper.toggleSiblingElement(
					JSPlayer.Captions.captionBtn,
					'svg',
					true
				)
			} else {
				if (JSPlayer.Captions.activeCuesLength > 0) {
					JSPlayer.Captions.customCaptions.style.display = 'block'
				} else {
					JSPlayer.Captions.customCaptions.style.display = 'none'
				}
				JSPlayer.Captions.isShowCaptions = true
				JSPlayer.Helper.toggleSiblingElement(
					JSPlayer.Captions.captionBtn,
					'svg'
				)
			}
		})

		this.captionTrack.addEventListener('cuechange', () => {
			const activeCues = JSPlayer.player.textTracks[0].activeCues

			JSPlayer.Captions.activeCuesLength = activeCues.length

			if (JSPlayer.Captions.isShowCaptions && activeCues.length > 0) {
				JSPlayer.Captions.showCaptions(activeCues[0].text)
			} else {
				JSPlayer.Captions.hideCaptions(
					activeCues.length > 0 && activeCues[0].text
				)
			}
		})
	},

	showCaptions: function (text) {
		if (text) {
			JSPlayer.Captions.customCaptions.innerText = text
		}
		JSPlayer.Captions.customCaptions.style.display = 'block'
	},

	hideCaptions: function (text) {
		if (text) {
			JSPlayer.Captions.customCaptions.innerText = text
		}
		JSPlayer.Captions.customCaptions.style.display = 'none'
	},
}
