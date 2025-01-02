'use strict'

const dataChapters = {
	chapters: [
		{
			name: 'Foundations of Video Editing',
			line: '0',
		},
		{
			name: 'Organizing Your Workflow',
			line: '100',
		},
		{
			name: 'Utilizing External Drives for Storage',
			line: '240',
		},
		{
			name: 'Choosing the Right Editing Software',
			line: '289',
		},
		{
			name: 'Trimming and Editing Process',
			line: '400',
		},
		{
			name: 'Incorporating B-roll and Stock Footage',
			line: '450',
		},
		{
			name: 'Adding Text and Templates',
			line: '600',
		},
		{
			name: 'Reviewing and Finalizing the Edit',
			line: '700',
		},
		{
			name: 'Rendering and Uploading with Camtasia',
			line: '800',
		},
		{
			name: 'Continuous Improvement in Editing',
			line: '1000',
		},
	],
}

const dataComments = {
	comments: [
		{
			id: '2912',
			item_code: 'Dino1qV66wxgBu2jL1ID',
			comment: 'This need to be color too.',
			parent_comment_id: '0',
			replies_count: '4',
			media_timestamp: '20.00859',
			commentator: null,
			date_created: '2024-07-18 06:24:34',
			date_updated: null,
			annotation_json:
				'[{"color":"#F73D72","id":"0","type":"rectangle","x1":"52.44","y1":"58.50","x2":"56.45","y2":"53.98"},{"color":"#F73D72","id":"1","type":"arrow","x1":"62.34","y1":"63.14","x2":"56.39","y2":"53.15"}]',
			latest_reply: {
				id: '2923',
				item_code: 'Dino1qV66wxgBu2jL1ID',
				comment: 'Fifth one',
				media_timestamp: '0',
				parent_comment_id: '2912',
				commentator: null,
				date_created: '2024-07-19 15:51:04',
				date_updated: null,
				user: {
					avatar_hash:
						'<figure class="c-avatar c-avatar--s c-avatar--no-img pull-left" data-original-title="sal kh" data-initials="S" style="border: 1px solid #D12A1E; background-color: #D12A1E"></figure>',
					first_name: 'sal',
					last_name: 'kh',
					email: 'salman@jumpshare.com',
				},
				is_super_owner: true,
				is_owner: true,
				comment_time: 'Jul 19',
			},
			user: {
				avatar_hash:
					'<figure class="c-avatar c-avatar--s c-avatar--no-img pull-left" data-original-title="sal kh" data-initials="S" style="border: 1px solid #D12A1E; background-color: #D12A1E"></figure>',
				first_name: 'sal',
				last_name: 'kh',
				email: 'salman@jumpshare.com',
			},
			is_super_owner: true,
			is_owner: true,
			comment_time: 'Jul 18',
		},
		{
			id: '2917',
			item_code: 'Dino1qV66wxgBu2jL1ID',
			comment: `Very big comment to check the length. I wonder how it will come out. I assume it will look good. But it's worth checking it out. I'm excited to improve this part of the product. Thanks for the output!`,
			parent_comment_id: '0',
			replies_count: '0',
			media_timestamp: '400.5064',
			commentator: null,
			date_created: '2024-07-19 12:04:22',
			date_updated: null,
			annotation_json:
				'[{"color":"#F73D72","id":"0","type":"rectangle","x1":"64.48","y1":"21.52","x2":"73.24","y2":"31.27"}]',
			user: {
				avatar_hash:
					'<figure class="c-avatar c-avatar--s c-avatar--no-img pull-left" data-original-title="sal kh" data-initials="S" style="border: 1px solid #D12A1E; background-color: #D12A1E"></figure>',
				first_name: 'sal',
				last_name: 'kh',
				email: 'salman@jumpshare.com',
			},
			is_super_owner: true,
			is_owner: true,
			comment_time: 'Jul 19',
		},
		{
			id: '2924',
			item_code: 'Dino1qV66wxgBu2jL1ID',
			comment:
				'This is first one This is first one This is first one This is first one This is first one This is first one',
			parent_comment_id: '0',
			replies_count: '4',
			media_timestamp: '1600',
			commentator: null,
			date_created: '2024-07-19 15:52:59',
			date_updated: null,
			annotation_json: null,
			latest_reply: {
				id: '2928',
				item_code: 'Dino1qV66wxgBu2jL1ID',
				comment: 'Fifth',
				media_timestamp: '0',
				parent_comment_id: '2924',
				commentator: null,
				date_created: '2024-07-19 15:53:28',
				date_updated: null,
				user: {
					avatar_hash:
						'<figure class="c-avatar c-avatar--s c-avatar--no-img pull-left" data-original-title="sal kh" data-initials="S" style="border: 1px solid #D12A1E; background-color: #D12A1E"></figure>',
					first_name: 'sal',
					last_name: 'kh',
					email: 'salman@jumpshare.com',
				},
				is_super_owner: true,
				is_owner: true,
				comment_time: 'Jul 19',
			},
			user: {
				avatar_hash:
					'<figure class="c-avatar c-avatar--s c-avatar--no-img pull-left" data-original-title="sal kh" data-initials="S" style="border: 1px solid #D12A1E; background-color: #D12A1E"></figure>',
				first_name: 'sal',
				last_name: 'kh',
				email: 'salman@jumpshare.com',
			},
			is_super_owner: true,
			is_owner: true,
			comment_time: 'Jul 19',
		},
	],
}

const dataCTA = {
	status: 1,
	item_code: 'dPPx88gfFBPsxQTyfPfG',
	title: 'Test',
	link: 'http://google.com',
	txt_color: '#FFFFFF',
	btn_color: '#1891ED',
	btn_type: '2',
	cta_type: 'link',
	cta_appearance: '0',
	cta_position: 'top-right',
	show_user_photo: '0',
	show_pulsing_effect: '0',
	cta_from: '0.00',
	avatar_url:
		"<figure class='c-avatar c-avatar--s c-avatar--no-img pull-left' data-original-title='Dmytro Pryvezentsev' data-initials='D' style='border: 1px solid #802476; background-color: #802476'></figure>",
	google_link_final: '',
}

document.addEventListener('DOMContentLoaded', () => {
	JSPlayer.bootstrap('player')

	// Initialize rough.js

	if (JSPlayer.Controls.annotationCanvasElement) {
		JSPlayer.Annotation.init()
		JSPlayer.Annotation.attach_controls()
		dataComments.comments.forEach(comment => {
			if (comment.annotation_json !== null) {
				JSPlayer.Annotation.attach_annotation_to_dom(
					comment.annotation_json,
					comment.id
				)
			}
		})
	}

	function hideAnnotationPanel() {
		JSPlayer.Controls.showAnnotationBtn.classList.remove('active')
		JSPlayer.Helper.toggleSiblingElement(
			JSPlayer.Controls.showAnnotationBtn,
			'svg',
			true
		)
		document.querySelector('#annotation_panel').classList.remove('active')
		JSPlayer.Annotation.reset_annotation()
		JSPlayer.Annotation.show_seekbar_and_timed_comments()
	}

	// HLS init
	const playerSrc = [
		'./20fd0242e93e4fdda762a05a8107cf73/4K-Nature-Film_-_Flow-Of-Life_-30-Minutes-of-Beautiful-Scenery-Relaxing-Music-for-Meditation.m3u8',
		'https://d1ffb1nfch3ckq.cloudfront.net/s095q2%2Ffile%2Fb9b3b32c193e7156d15bdaa2d1929778_f839b6774122ccba2d2b82a1bdc13a48.mp4?response-content-disposition=inline%3Bfilename%3D%22b9b3b32c193e7156d15bdaa2d1929778_f839b6774122ccba2d2b82a1bdc13a48.mp4%22%3B&response-content-type=video%2Fmp4&Expires=1733943645&Signature=EVqiq~KETO974nd288O6-l-soTTJE13EQZ42-mfCpPbJEjxuxdvXoxiBQSc7utUuNCjyXME0E9vx1EzpFyvT2Y78o8xVS46gbo608GAC4NAfUXIJs2jVhnE-N1e~1GhznOlibVO~HNT7poTmIFJilhE7TPrwokhBa9SMv-PRo4SRW9RTbzqK~nLFQaPtffaw8drvwrFeJAM61d52Qf-opuVOKKX5iP4vo9aFF7MXAvpy2J-cbiml658BXZ~LC8KsJ6SYGCdRD-l8cC-9dtnOunkF0tyM7TudLbS4m-B8U1hX4ou2zWQp9-FEofqxy1KAcaPV9YWcS-kIXwli4X-hnA__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ',
		'https://ocean.mirzabilal.com/iptv/hls/master.m3u8',
		'https://ocean.mirzabilal.com/iptv/video/prog_index.m3u8',
		'https://pouch.jumpshare.com/preview/Qjt3ugFQGgm4Y8JpRA0rfm__JCrhCMl5d7kMvbKsOo0jEPVHdMDF5jYX0vdGb5Xd3dWUsh08EM5cj_JG5VvR68HgJa121kzIBah3WDzasLDBS4kZvaALozU96IoQAgGxngEC3xGSYmw8_u7TW2cE9G6yjbN-I2pg_cnoHs_AmgI.mp4',
		' https://d2o0is6348o2o4.cloudfront.net/k0r9n1%2Ffile%2F47e467f1b79fabf59ca8894184ddb80c_87e7b8003dbfff7dda72a252c6b2e5dc.mp4?response-content-disposition=inline%3Bfilename%3D%2247e467f1b79fabf59ca8894184ddb80c_87e7b8003dbfff7dda72a252c6b2e5dc.mp4%22%3B&response-content-type=video%2Fmp4&Expires=1735141842&Signature=dgCY0jr9CoaynRzwaLNd1Crlb0cE~TBflrWRDYcQrMni10PzEXsQXnpCIJKJxbBhl8YDoeX~ifBYWKj1rSZjtc91TmHDsL6WW8ED19DHHkK~qJuBAWlmJhKTwLfOliJdO7TbQ9EglBu7PUDTZqGNX~WdMLENZb3dhgzWPjnPfvBApRryQnbUUHSdd~xxTBc-woZwsUIWxm8LhbxUnMAV1S1q74yRyw8vEMIb2l-G2m8vcfoDrS5Yja8X~0Qeq9X92Le0t4B0kk409e9e3~dGEvyV-0N3BFEromMIcJ8ZD0YF0DnJyZwUjpPxiunm0hlAYtKeyRhOVupJy9eY0FWeuQ__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ',
		'https://ocean.mirzabilal.com/iptv/video/prog_index.m3u8',
	]

	let activePlayerSrc = 0

	if (
		JSPlayer.player.canPlayType('application/vnd.apple.mpegurl') ||
		playerSrc[activePlayerSrc].includes('.mp4')
	) {
		JSPlayer.player.src = playerSrc[activePlayerSrc]
	} else if (Hls.isSupported()) {
		var hls = new Hls()
		hls.loadSource(playerSrc[activePlayerSrc])
		hls.attachMedia(JSPlayer.player)
	} else {
		console.warn('HLS not supported')
	}

	const commentNewTextareaWrapper = document.querySelector(
		'.comment-new-textarea-wrapper'
	)
	const addCommentBtn = document.querySelector('#add-comment')
	const commentText = document.querySelector('#comment-text')
	commentNewTextareaWrapper.addEventListener('click', () => {
		JSPlayer.player.pause()
	})

	addCommentBtn.addEventListener('click', () => {
		if (commentText.value !== '') {
			const id = Number(new Date().getTime() * Math.random())
			const shapes =
				JSPlayer.Annotation.shapes.length > 0
					? JSON.stringify(JSPlayer.Annotation.shapes)
					: null

			const oldAnnotation = []

			hideAnnotationPanel()

			if (shapes) {
				dataComments.comments.forEach(comment => {
					if (comment.annotation_json !== null) {
						oldAnnotation.push({
							annotation: comment.annotation_json,
							id: comment.id,
						})
					}
				})
				oldAnnotation.push({
					annotation: shapes,
					id: id,
				})
			}

			JSPlayer.Comments.add(
				{
					id: id,
					seconds: JSPlayer.player.currentTime,
					comment: commentText.value,
					shapes,
				},
				dataComments
			)

			if (shapes) {
				oldAnnotation.forEach(item => {
					JSPlayer.Annotation.attach_annotation_to_dom(item.annotation, item.id)
				})
			}
			commentText.value = ''
		}
	})
})
