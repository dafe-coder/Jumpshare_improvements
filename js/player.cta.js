JSPlayer.CTA = {
	isCTAButtonGenerated: false,
	
	init: function () {
		this.isCTAButtonGenerated = false
	},

	generateCTAButton: function (dataCTA) {
		const ctaButton = document.createElement('a')
		ctaButton.href = dataCTA.link
		ctaButton.className = `player-cta-button-default player-cta-button ${dataCTA.cta_position}`
		ctaButton.style.backgroundColor = dataCTA.btn_color
		ctaButton.style.color = dataCTA.txt_color
		ctaButton.textContent = dataCTA.title

		JSPlayer.Controls.playerWrap.appendChild(ctaButton)

		const ctaButtonClone = ctaButton.cloneNode(true)
		ctaButtonClone.classList.add('centered')
		ctaButtonClone.classList.remove('player-cta-button-default')
		console.log(JSPlayer.Controls.playerOverlayEnd)
		JSPlayer.Controls.playerOverlayEnd.appendChild(ctaButtonClone)
	},
}
