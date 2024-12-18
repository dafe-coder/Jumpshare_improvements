JSPlayer.Comments = {
	commentsContainer: null,
	player: null,

	init: function (playerObj, container) {
		this.commentsContainer = container
		this.player = playerObj
	},

	add: function (data, dataComments) {
		const { seconds, comment, shapes = null, id = '' } = data
		console.log('shapes', shapes)
		const dataComment = {
			id: id != '' ? id : Number(new Date().getTime() * Math.random()),
			user: {
				first_name: dataComments.comments[0].user.first_name,
				last_name: dataComments.comments[0].user.last_name,
			},
			media_timestamp: seconds,
			comment_time: JSPlayer.Helper.getCurrentDateFormatted(new Date()),
			comment: comment,
			annotation_json: shapes,
			replies_count: 0,
		}
		this.commentsContainer.innerHTML += this.create(dataComment)
	},

	delete: function (commentId) {
		const commentItem = document.querySelector(
			`.controls-comments-item[data-id="${commentId}"]`
		)
		commentItem.remove()
	},

	load: function (dataComments) {
		if (!dataComments?.comments?.length) return

		dataComments.comments.forEach(comment => {
			this.commentsContainer.innerHTML += this.create(comment)
		})

		this.commentsContainer.addEventListener('click', e => {
			const commentItem = e.target.closest('.controls-comments-item')
			if (commentItem) {
				player.pause()
				player.currentTime = Number(commentItem.dataset.timestamp)
				JSPlayer.Annotation.show_current_annotation_with_time(
					commentItem.dataset.id
				)
				JSPlayer.Chapters.chooseActiveChapter()
				JSPlayer.Utils.updateSlider()
			}
		})
	},

	create: function (comment) {
		const left = (comment.media_timestamp / player.duration) * 100

		return `<div class="controls-comments-item" style="left: ${left}%" data-timestamp="${comment.media_timestamp}" data-id="${comment.id}">
						<div class='controls-comments-avatar'>
							<span>${comment.user.first_name.charAt(0)}</span>
							<div class='controls-comments-avatar-image'>
							<!-- <img src="" /> -->
							</div>
							${comment.annotation_json && comment.annotation_json !== null ? "<span class='annotation-comment-indicator'></span>" : ''}
						</div>
						<div class='controls-comments-info'>
							<div class='controls-comments-info-text'>
								<h5>
									${comment.user.first_name + ' ' + comment.user.last_name}
									<span>${comment.comment_time}</span>
								</h5>
								<p>${comment.comment}</p>
								${comment.replies_count > 0 ? `<span class='controls-comments-info-reply'>${comment.replies_count}+ other comment</span>` : ''}
							</div>
							<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 13L7 7L1 1" stroke="#f1f1f1" stroke-width="1.5" stroke-linejoin="round"></path>
							</svg>
						</div>
					</div>`
	},
}