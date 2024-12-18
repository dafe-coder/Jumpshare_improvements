JSPlayer.Helper = {
    formatTime: function(seconds, named = false) {
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
	},
	
	getCurrentDateFormatted: function(date) {
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		const day = date.getDate()
		const month = monthNames[date.getMonth()]
		return `${month} ${day}`
	},
	

	parseToSeconds: function(time) {
		const timeParts = time.split(':')

		let totalSeconds = 0

		if (timeParts.length === 3) {
			const [hours, minutes, seconds] = timeParts
			totalSeconds = +hours * 3600 + +minutes * 60 + +seconds
		} else if (timeParts.length === 2) {
			const [minutes, seconds] = timeParts
			totalSeconds = +minutes * 60 + +seconds
		}
		return totalSeconds
	}
};