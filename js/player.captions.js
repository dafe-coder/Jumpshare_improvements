JSPlayer.Captions = {
	customCaptions: null,

	init(customCaptions) {
		this.customCaptions = customCaptions
	},

	showCaptions: function (text) {
		if (text) {
			this.customCaptions.innerText = text
		}
		this.customCaptions.style.display = 'block'
	},

	hideCaptions: function (text) {
		if (text) {
			this.customCaptions.innerText = text
		}
		this.customCaptions.style.display = 'none'
	},
}
