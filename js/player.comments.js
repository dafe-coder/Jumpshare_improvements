JSPlayer.Comments = {
	dataComments: null,
	commentPosId: null,

	init: function () {
		//
	},

	add: function (comment) {
		const { seconds, text, shapes = null, id = '' } = comment
		const data = {
			id: id != '' ? id : Number(new Date().getTime() * Math.random()),
			user: {
				first_name: this.dataComments.comments[0].user.first_name,
				last_name: this.dataComments.comments[0].user.last_name,
			},
			media_timestamp: seconds,
			comment_time: JSPlayer.Helper.getCurrentDateFormatted(new Date()),
			comment: text,
			annotation_json: shapes,
			replies_count: 0,
		}

		JSPlayer.Controls.commentsContainer.innerHTML += this.create(data)
		this.getOverflowRight()
	},

	delete: function (commentId) {
		const commentItem = document.querySelector(
			`.controls-comments-item[data-id="${commentId}"]`
		)
		commentItem.remove()
	},

	load: function (data) {
		if (!data?.comments?.length) return

		this.dataComments = data

		this.dataComments.comments.forEach(comment => {
			JSPlayer.Controls.commentsContainer.innerHTML += this.create(comment)
		})
		this.getOverflowRight()
		JSPlayer.Controls.commentsContainer.addEventListener('click', e => {
			const commentItem = e.target.closest('.controls-comments-item')
			if (commentItem) {
				JSPlayer.player.pause()
				JSPlayer.player.currentTime = Number(commentItem.dataset.timestamp)
				JSPlayer.Annotation.show_current_annotation_with_time(
					commentItem.dataset.id
				)
				JSPlayer.Chapters.chooseActiveChapter()
				JSPlayer.updateSlider()
			}
		})
	},

	create: function (comment) {
		const left = (comment.media_timestamp / JSPlayer.player.duration) * 100

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

	checkIsCommentActive: function (currentTime) {
		const commentsItems = document.querySelectorAll('.controls-comments-item')
		const COMMENT_DURATION = 5

		const sortedComments = Array.from(commentsItems).sort((a, b) => {
			return parseFloat(a.dataset.timestamp) - parseFloat(b.dataset.timestamp)
		})

		sortedComments.forEach((item, index) => {
			const commentTimestamp = parseFloat(item.dataset.timestamp)
			const nextComment = sortedComments[index + 1]
			const nextCommentTimestamp = nextComment
				? parseFloat(nextComment.dataset.timestamp)
				: Infinity
			const commentEndTime = commentTimestamp + COMMENT_DURATION
			const commentEndTimeAnnotation = commentTimestamp + 0.1

			if (currentTime < commentTimestamp) {
				item.classList.remove('active')
				if (item.dataset.id === commentsItems[0].dataset.id) {
					JSPlayer.Annotation.hide_current_annotation_with_time(item.dataset.id)
				}
			} else if (currentTime >= commentTimestamp) {
				if (
					currentTime < nextCommentTimestamp &&
					currentTime <= commentEndTime
				) {
					JSPlayer.Annotation.show_current_annotation_with_time(item.dataset.id)
					item.classList.add('active')
				} else {
					item.classList.remove('active')
				}
				if (
					currentTime < nextCommentTimestamp &&
					currentTime >= commentEndTimeAnnotation
				) {
					JSPlayer.Annotation.hide_current_annotation_with_time(item.dataset.id)
				}
			}
		})
	},
	getOverflowRight: function () {
		this.commentPosId = setTimeout(() => {
			JSPlayer.Controls.commentsContainer
				.querySelectorAll('.controls-comments-item')
				.forEach(commentItem => {
					requestAnimationFrame(() => {
						const rectInfo = commentItem.querySelector(
							'.controls-comments-info'
						)
						const rect = commentItem
							.querySelector('.controls-comments-info')
							.getBoundingClientRect()

						const playerPos = JSPlayer.player.getBoundingClientRect()

						const overflowRight =
							rect.left + rect.width - (playerPos.left + playerPos.width)

						if (overflowRight > 0) {
							rectInfo.classList.add('ml-18')
							rectInfo.style.left = `-${overflowRight + 10}px`
						}
					})
				})
			clearTimeout(this.commentPosId)
		}, 10)
	},
}
