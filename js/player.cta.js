JSPlayer.CTA = {
	playerWrap: null,
	playerOverlayEnd: null,

	init: function (playerWrap, playerOverlayEnd) {
		this.playerWrap = playerWrap
		this.playerOverlayEnd = playerOverlayEnd
	},

	generateCTAButton: function (dataCTA) {
		const ctaButton = document.createElement('a')
		ctaButton.href = dataCTA.link
		ctaButton.className = `player-cta-button-default player-cta-button ${dataCTA.cta_position}`
		ctaButton.style.backgroundColor = dataCTA.btn_color
		ctaButton.style.color = dataCTA.txt_color
		ctaButton.textContent = dataCTA.title

		this.playerWrap.appendChild(ctaButton)

		const ctaButtonClone = ctaButton.cloneNode(true)
		ctaButtonClone.classList.add('centered')
		ctaButtonClone.classList.remove('player-cta-button-default')
		this.playerOverlayEnd.appendChild(ctaButtonClone)
	},
}
