JSPlayer.Annotation = {
	handle_annotation_id: '#show-annotation',
	annotation_panel_id: '#annotation_panel',
	annotation_canvas_id: '#annotation_canvas',
	offsetX: 0,
	offsetY: 0,
	resizeDir: null,
	rect_count: 0,
	initialWindowWidth: 0,
	initialWindowHeight: 0,
	ctx: null,
	roughCanvas: null,
	generator: null,
	isDrawing: false,
	action: null,
	currentTool: 'rectangle',
	currentColor: '#F73D72',
	shapes: [],
	previous_annotation: [],
	annotation_has_started: false,
	editMode: false,
	event_added: false,
	in_annotation_mode: false,
	shadowOptions: {
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffsetX: 1.5,
		shadowOffsetY: 1.5,
		shadowBlur: 1,
	},

	init: function () {
		this.bootstrap()
		this.attachWindowResizeListener()
	},

	bootstrap: function () {
		this.bootstrap_dom()
	},

	bootstrap_dom: function () {
		this.handle_annotation = $(this.handle_annotation_id)
		this.annotation_panel = $(this.annotation_panel_id)
		this.annotation_canvas = $(this.annotation_canvas_id)
		this.add_annotation_panel()
		this.initialWindowWidth = $('#video_wrapper').width()
		this.initialWindowHeight = $('#video_wrapper').height()
		// window.addEventListener('resize', this.attachWindowResizeListener, false);
	},

	px_to_percentage_vertical: function (px, initialWindowHeight) {
		return (px / initialWindowHeight) * 100
	},
	percentage_to_px_vertical: function (percentage, initialWindowHeight) {
		return (percentage * initialWindowHeight) / 100
	},
	px_to_percentage_horizontal: function (px, initialWindowWidth) {
		return (px / initialWindowWidth) * 100
	},
	percentage_to_px_horizontal: function (percentage, initialWindowWidth) {
		return (parseFloat(percentage).toFixed(2) * initialWindowWidth) / 100
	},
	addAnnotationPanelID: null,
	add_annotation_panel: function () {
		this.handle_annotation.unbind().bind('click', () => {
			const showAnnotationBtn = document.querySelector('#show-annotation')

			this.first_time_clicked = true
			if ($('#annotation_canvas').hasClass('pointer-events-none')) {
				$('#annotation_canvas').addClass('hide')
				$('#annotation_canvas').removeClass('pointer-events-none')
			}

			if (!$('#annotation_canvas').hasClass('hide')) {
				showAnnotationBtn.classList.remove('active')
				JSPlayer.Helper.toggleSiblingElement(showAnnotationBtn, 'svg', true)
				document.querySelector('#annotation_panel').classList.remove('active')
				$('#annotation_canvas').addClass('hide')
				this.reset_annotation()
				this.show_seekbar_and_timed_comments()
				this.ctx &&
					this.ctx.clearRect(
						0,
						0,
						this.annotation_canvas[0].width,
						this.annotation_canvas[0].height
					)
				this.currentColor = '#F73D72'
				this.currentTool = 'rectangle'
				this.shapes = []
				this.shapes.splice(0, this.shapes.length)
			} else {
				JSPlayer.Controls.preparePlayerWhenStartPlaying()
				player.pause()
				JSPlayer.Helper.toggleSiblingElement(
					JSPlayer.Controls.playOrPauseBtn,
					'svg',
					true
				)

				let time =
					this.addAnnotationPanelID == null && JSPlayer.Controls.isPreviewShow
						? 200
						: 10

				this.addAnnotationPanelID = setTimeout(() => {
					showAnnotationBtn.classList.add('active')
					JSPlayer.Helper.toggleSiblingElement(showAnnotationBtn, 'svg')
					document.querySelector('#annotation_panel').classList.add('active')
					$('#annotation_canvas').removeClass('hide')
					this.initializ_canvas()
					this.hide_seekbar_and_timed_comments()
					this.attach_annotation_panel()
					clearTimeout(this.addAnnotationPanelID)
				}, time)
			}

			if (!player.startedPlaying) {
				$('.player-overlay-start').addClass('hide')
			}
		})
	},

	hide_seekbar_and_timed_comments: function () {
		player.pause()
		$('.controls').removeClass('active')
		$('.player-cta-button').addClass('hide')
		$('.controls-comments').css('visibility', 'hidden')
		$('.controls-comments').addClass('hide')
		// $('#custom_captions_wrapper').addClass('hide')
		// $('#time_stmp_coments_wrpr').addClass('stick_to_bottom')
	},

	show_seekbar_and_timed_comments: function () {
		player.pause()
		$('.controls').addClass('active')
		$('.player-cta-button').removeClass('hide')
		$('.controls-comments').css('visibility', 'visible')
		$('.controls-comments').removeClass('hide')
		// $('#custom_captions_wrapper').removeClass('hide')
		// $('#time_stmp_coments_wrpr').addClass('stick_to_bottom')
	},

	attach_annotation_to_dom: function (annotation_arr, id) {
		this.initializ_canvas()

		let _annotation_arr = JSON.parse(annotation_arr).map(item => {
			if (item.type === 'freehand') {
				return {
					color: item.color,
					type: item.type,
					id: parseFloat(item.id).toFixed(2),
					x1: parseFloat(item.x1).toFixed(2),
					x2: parseFloat(item.x2).toFixed(2),
					y1: parseFloat(item.y1).toFixed(2),
					y2: parseFloat(item.y2).toFixed(2),
					points: item.points.map(point => ({
						x2: parseFloat(point.x2).toFixed(2),
						y2: parseFloat(point.y2).toFixed(2),
					})),
				}
			} else {
				return this.create_new_element(
					parseFloat(item.id).toFixed(2),
					parseFloat(item.x1).toFixed(2),
					parseFloat(item.y1).toFixed(2),
					parseFloat(item.x2).toFixed(2),
					parseFloat(item.y2).toFixed(2),
					item.type,
					item.color
				)
			}
		})

		this.previous_annotation.push({
			comment_id: id,
			annotation: _annotation_arr,
		})
	},

	get_distance: function (a, b) {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
	},

	create_new_element: function (id, x1, y1, x2, y2, type, color) {
		let roughElement

		let _x1 = this.percentage_to_px_horizontal(x1, $('#video_wrapper').width())
		let _y1 = this.percentage_to_px_vertical(y1, $('#video_wrapper').height())
		let _x2 = this.percentage_to_px_horizontal(x2, $('#video_wrapper').width())
		let _y2 = this.percentage_to_px_vertical(y2, $('#video_wrapper').height())
		let arrowDawan = false
		if (this.annotation_canvas[0]) {
			if (type === 'line') {
				roughElement = this.generator.line(_x1, _y1, _x2, _y2, {
					roughness: 0,
					stroke: color,
					strokeWidth: 6,
				})
				return { id, x1, y1, x2, y2, type, roughElement, color }
			} else if (type === 'circle') {
				const width = Math.abs(_x2 - _x1)
				const height = Math.abs(_y2 - _y1)
				const diameter = Math.max(width, height)
				roughElement = this.generator.circle(_x1, _y1, diameter, {
					roughness: 0,
					stroke: color,
					strokeWidth: 6,
				})
				return { id, x1, y1, x2, y2, type, roughElement, color }
			} else if (type === 'rectangle') {
				roughElement = this.generator.rectangle(
					_x1,
					_y1,
					_x2 - _x1,
					_y2 - _y1,
					{ roughness: 0, stroke: color, strokeWidth: 6 }
				)
				return { id, x1, y1, x2, y2, type, roughElement, color }
			} else if (type === 'arrow') {
				const angle = Math.atan2(_y2 - _y1, _x2 - _x1)
				const headLength = 20
				const headWidth = 20
				const insetDepth = headWidth * 0.3

				const offset = -5
				const baseX = _x2 - offset * Math.cos(angle)
				const baseY = _y2 - offset * Math.sin(angle)

				const tipX = baseX + headLength * 0.2 * Math.cos(angle)
				const tipY = baseY + headLength * 0.2 * Math.sin(angle)

				const shoulderX = baseX - headLength * 0.8 * Math.cos(angle)
				const shoulderY = baseY - headLength * 0.8 * Math.sin(angle)

				const perpAngle = angle + Math.PI / 2
				const leftX = shoulderX + (headWidth / 2) * Math.cos(perpAngle)
				const leftY = shoulderY + (headWidth / 2) * Math.sin(perpAngle)
				const rightX = shoulderX - (headWidth / 2) * Math.cos(perpAngle)
				const rightY = shoulderY - (headWidth / 2) * Math.sin(perpAngle)

				const insetX = shoulderX + insetDepth * Math.cos(angle)
				const insetY = shoulderY + insetDepth * Math.sin(angle)

				roughElement = {
					path: `M ${_x1} ${_y1} L ${_x2} ${_y2}`,
					cursor: `M ${leftX} ${leftY} 
							L ${tipX} ${tipY} 
							L ${rightX} ${rightY}
							L ${insetX} ${insetY}
							L ${leftX} ${leftY}`,
					fill: color,
				}

				return { id, x1, y1, x2, y2, type, roughElement, color }
			} else if (type === 'freehand') {
				return {
					id,
					type,
					_x1,
					_y1,
					_x2,
					_y2,
					points: [{ x: x1, y: y1 }],
					color,
				}
			}
		}
	},

	is_on_the_line: function (x1, y1, x2, y2, x, y, maxDistance = 1) {
		const a = { x: x1, y: y1 }
		const b = { x: x2, y: y2 }
		const c = { x, y }
		const offset =
			this.get_distance(a, b) -
			(this.get_distance(a, c) + this.get_distance(b, c))
		return Math.abs(offset) < maxDistance ? 'inside' : null
	},

	is_with_element: function (x, y, element) {
		const { type, x1, x2, y1, y2 } = element
		if (type === 'rectangle') {
			const minX = Math.min(x1, x2)
			const maxX = Math.max(x1, x2)
			const minY = Math.min(y1, y2)
			const maxY = Math.max(y1, y2)
			return x >= minX && x <= maxX && y >= minY && y <= maxY
		} else if (type === 'circle') {
			const centerX = this.percentage_to_px_horizontal(
				x1,
				$('#video_wrapper').width()
			)
			const centerY = this.percentage_to_px_vertical(
				y1,
				$('#video_wrapper').height()
			)
			const clickX = this.percentage_to_px_horizontal(
				x,
				$('#video_wrapper').width()
			)
			const clickY = this.percentage_to_px_vertical(
				y,
				$('#video_wrapper').height()
			)

			const radius = Math.abs(
				this.percentage_to_px_horizontal(x2, $('#video_wrapper').width()) -
					this.percentage_to_px_horizontal(x1, $('#video_wrapper').width())
			)

			const distance = Math.sqrt(
				Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
			)

			return distance <= radius
		} else if (type === 'line') {
			const a = { x: x1, y: y1 }
			const b = { x: x2, y: y2 }
			const c = { x, y }
			const offset =
				this.get_distance(a, b) -
				(this.get_distance(a, c) + this.get_distance(b, c))
			return Math.abs(offset) < 1
		} else if (type === 'arrow') {
			const a = { x: x1, y: y1 }
			const b = { x: x2, y: y2 }
			const c = { x, y }
			const offset =
				this.get_distance(a, b) -
				(this.get_distance(a, c) + this.get_distance(b, c))
			return Math.abs(offset) < 1
		} else if (type === 'freehand') {
			const betweenAnyPoint = element.points.some((point, index) => {
				const nextPoint = element.points[index + 1]
				if (!nextPoint) return false
				return (
					this.is_on_the_line(
						point.x2,
						point.y2,
						nextPoint.x2,
						nextPoint.y2,
						x,
						y,
						5
					) != null
				)
			})
			return betweenAnyPoint ? 'inside' : null
		}
	},

	updatedElement: function (id, x1, y1, x2, y2, type, color) {
		if (type === 'freehand') {
			// const _updatedElement = this.create_new_element(id, x1, y1, x2, y2, type, color);
			this.shapes[id].points = [...this.shapes[id].points, { x2, y2 }]
			this.render()
		} else {
			const _updatedElement = this.create_new_element(
				id,
				x1,
				y1,
				x2,
				y2,
				type,
				color
			)
			this.shapes[id] = _updatedElement
			this.render()
		}
	},

	initializ_canvas: function () {
		console.log('initializ_canvas')
		this.annotation_has_started = true

		if (this.annotation_canvas[0]) {
			this.ctx = this.annotation_canvas[0].getContext('2d')
			this.roughCanvas = rough.canvas(this.annotation_canvas[0])
			this.generator = this.roughCanvas.generator
			this.annotation_canvas[0].width = $('#video_wrapper').width()
			this.annotation_canvas[0].height = $('#video_wrapper').height()

			this.ctx.lineWidth = 6
			this.ctx.strokeStyle = this.currentColor
			this.ctx.lineJoin = 'round'
			this.ctx.lineCap = 'round'
			if (this.ctx) {
				this.ctx.shadowColor = this.shadowOptions.shadowColor
				this.ctx.shadowBlur = this.shadowOptions.shadowBlur
				this.ctx.shadowOffsetX = this.shadowOptions.shadowOffsetX
				this.ctx.shadowOffsetY = this.shadowOptions.shadowOffsetY
			}
		}
	},

	attach_annotation_panel: function () {
		$('#annotation_canvas').addClass('darwingMode')
		if (!this.event_added) {
			this.initializ_canvas()
			this.attach_event_listeners_to_canvas()
		}
	},

	attach_event_listeners_to_canvas: function () {
		this.event_added = true
		const getElementAtPosition = (x, y, shapes) => {
			return shapes.find(element => this.is_with_element(x, y, element))
		}
		$('#annotation_canvas')
			.off('mousedown')
			.on('mousedown', e => {
				e.stopPropagation()
				this.hide_seekbar_and_timed_comments()
				this.in_annotation_mode = true
				const { offsetX, offsetY } = e
				if (this.action === 'delete') {
					let _offsetX = this.px_to_percentage_horizontal(
						offsetX,
						$('#video_wrapper').width()
					)
					let _offsetY = this.px_to_percentage_vertical(
						offsetY,
						$('#video_wrapper').height()
					)

					const element = getElementAtPosition(_offsetX, _offsetY, this.shapes)
					if (element) {
						this.shapes = this.shapes.filter(item => item.id !== element.id)
						this.render()
					}
				} else {
					this.action = 'drawing'
					this.isDrawing = true
					let id = this.shapes.length

					let _offsetX = this.px_to_percentage_horizontal(
						offsetX,
						$('#video_wrapper').width()
					)
					let _offsetY = this.px_to_percentage_vertical(
						offsetY,
						$('#video_wrapper').height()
					)

					const element = this.create_new_element(
						id,
						_offsetX,
						_offsetY,
						_offsetX,
						_offsetY,
						this.currentTool,
						this.currentColor
					)
					this.shapes.push(element)
				}
			})

		$('#annotation_canvas')
			.off('mousemove')
			.on('mousemove', e => {
				e.stopPropagation()
				const { offsetX, offsetY } = e

				const updated_offsetX =
					offsetX *
					(this.annotation_canvas[0].width /
						this.annotation_canvas[0].clientWidth)
				const updated_offsetY =
					offsetY *
					(this.annotation_canvas[0].height /
						this.annotation_canvas[0].clientHeight)
				let _offsetX = this.px_to_percentage_horizontal(
					updated_offsetX,
					$('#video_wrapper').width()
				)
				let _offsetY = this.px_to_percentage_vertical(
					updated_offsetY,
					$('#video_wrapper').height()
				)

				if (this.currentTool === 'delete') {
					// let _offsetX = this.px_to_percentage_horizontal(offsetX, $("#video_wrapper").width());
					// let _offsetY = this.px_to_percentage_vertical(offsetY, $("#video_wrapper").height());

					const element = getElementAtPosition(_offsetX, _offsetY, this.shapes)
					if (element) {
						$('#annotation_canvas').addClass('delete_mode')
					} else {
						$('#annotation_canvas').removeClass('delete_mode')
					}
				}
				if (!this.isDrawing) {
					return
				}
				if (this.action === 'drawing') {
					const index = this.shapes.length - 1
					const { x1, y1 } = this.shapes[index]

					// let _offsetX = this.px_to_percentage_horizontal(offsetX, $("#video_wrapper").width());
					// let _offsetY = this.px_to_percentage_vertical(offsetY, $("#video_wrapper").height());

					this.updatedElement(
						index,
						x1,
						y1,
						_offsetX,
						_offsetY,
						this.currentTool,
						this.currentColor
					)
				}
			})

		$('#annotation_canvas').on('mouseup', e => {
			e.stopPropagation()
			this.isDrawing = false
		})
	},

	attach_controls: function () {
		$('#rect_shape')
			.unbind()
			.bind('click', () => {
				console.log('arrow_shape')

				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#rect_shape').addClass('active')
				this.currentTool = 'rectangle'
				this.action = 'drawing'
			})

		$('#circle_shape')
			.unbind()
			.bind('click', () => {
				console.log('circle_shape')

				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#circle_shape').addClass('active')
				this.currentTool = 'circle'
				this.action = 'drawing'
			})

		$('#arrow_shape')
			.unbind()
			.bind('click', () => {
				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#arrow_shape').addClass('active')
				this.currentTool = 'arrow'
				this.action = 'drawing'
			})

		$('#line_shape')
			.unbind()
			.bind('click', () => {
				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#line_shape').addClass('active')
				this.currentTool = 'line'
				this.action = 'drawing'
			})

		$('#pencil_shape')
			.unbind()
			.bind('click', () => {
				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#pencil_shape').addClass('active')
				this.currentTool = 'freehand'
				this.action = 'drawing'
			})

		$('#delete_shape')
			.unbind()
			.bind('click', () => {
				$('#darwing_shapes_wrapper span').removeClass('active')
				$('#delete_shape').addClass('active')
				this.currentTool = 'delete'
				isDeleteMode = false
				this.action = 'delete'
			})

		$('#green_ann')
			.unbind()
			.bind('click', () => {
				$('#darwing_colors_wrapper span').removeClass('active')
				$('#green_ann').addClass('active')
				this.currentColor = '#34E33B'
			})

		$('#blue_ann')
			.unbind()
			.bind('click', () => {
				$('#darwing_colors_wrapper span').removeClass('active')
				$('#blue_ann').addClass('active')
				this.currentColor = '#3696F6'
			})

		$('#red_ann')
			.unbind()
			.bind('click', () => {
				$('#darwing_colors_wrapper span').removeClass('active')
				$('#red_ann').addClass('active')
				this.currentColor = '#F73D72'
			})

		$('#yellow_ann')
			.unbind()
			.bind('click', () => {
				$('#darwing_colors_wrapper span').removeClass('active')
				$('#yellow_ann').addClass('active')
				this.currentColor = '#FDF14C'
			})

		$('#orange_ann')
			.unbind()
			.bind('click', () => {
				$('#darwing_colors_wrapper span').removeClass('active')
				$('#orange_ann').addClass('active')
				this.currentColor = '#FB9348'
			})
	},

	render: function () {
		if (this.ctx === null) return
		console.log('render')

		this.ctx.clearRect(
			0,
			0,
			this.annotation_canvas[0].width,
			this.annotation_canvas[0].height
		)
		this.shapes.forEach(
			({ type, roughElement, points, color, x1, y1, x2, y2, index }) => {
				if (type === 'arrow') {
					this.ctx.shadowColor = 'rgba(0,0,0,0.3)'
					this.ctx.shadowBlur = 1
					this.ctx.shadowOffsetX = 1.5
					this.ctx.shadowOffsetY = 1.5

					this.ctx.beginPath()
					this.ctx.lineCap = 'round'
					this.ctx.fillStyle = color
					this.ctx.strokeStyle = color
					this.ctx.lineWidth = 6

					const completePath = new Path2D(roughElement.path)
					this.ctx.lineJoin = 'round'
					const cursorPath = new Path2D(roughElement.cursor)
					completePath.addPath(cursorPath)

					this.ctx.stroke(completePath)

					this.ctx.shadowColor = 'transparent'
					this.ctx.shadowBlur = 0
					this.ctx.shadowOffsetX = 0
					this.ctx.shadowOffsetY = 0

					this.ctx.fill(cursorPath)

					this.ctx.shadowColor = 'rgba(0,0,0,0.3)'
					this.ctx.shadowBlur = 1
					this.ctx.shadowOffsetX = 1.5
					this.ctx.shadowOffsetY = 1.5
				} else if (type === 'circle') {
					const centerX = this.percentage_to_px_horizontal(
						x1,
						$('#video_wrapper').width()
					)
					const centerY = this.percentage_to_px_vertical(
						y1,
						$('#video_wrapper').height()
					)
					const radius = Math.abs(
						this.percentage_to_px_horizontal(x2, $('#video_wrapper').width()) -
							this.percentage_to_px_horizontal(x1, $('#video_wrapper').width())
					)

					this.ctx.beginPath()
					this.ctx.strokeStyle = color
					this.ctx.lineWidth = 6
					this.ctx.shadowColor = this.shadowOptions.shadowColor
					this.ctx.shadowBlur = this.shadowOptions.shadowBlur
					this.ctx.shadowOffsetX = this.shadowOptions.shadowOffsetX
					this.ctx.shadowOffsetY = this.shadowOptions.shadowOffsetY

					this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
					this.ctx.stroke()
				} else if (type === 'freehand') {
					this.ctx.beginPath()
					this.ctx.lineWidth = 6
					this.ctx.strokeStyle = color
					this.ctx.lineJoin = 'round'
					this.ctx.lineCap = 'round'
					if (points.length > 0) {
						let _x1 = this.percentage_to_px_horizontal(
							points[0].x2,
							$('#video_wrapper').width()
						)
						let _y1 = this.percentage_to_px_vertical(
							points[0].y2,
							$('#video_wrapper').height()
						)

						this.ctx.moveTo(_x1, _y1)
					}
					for (let i = 1; i < points.length - 2; i++) {
						let _x2 = this.percentage_to_px_horizontal(
							points[i].x2,
							$('#video_wrapper').width()
						)
						let _y2 = this.percentage_to_px_vertical(
							points[i].y2,
							$('#video_wrapper').height()
						)
						let _x2_next = this.percentage_to_px_horizontal(
							points[i + 1].x2,
							$('#video_wrapper').width()
						)
						let _y2_next = this.percentage_to_px_vertical(
							points[i + 1].y2,
							$('#video_wrapper').height()
						)

						const xc = (_x2 + _x2_next) / 2
						const yc = (_y2 + _y2_next) / 2
						this.ctx.quadraticCurveTo(
							this.percentage_to_px_horizontal(
								points[i].x2,
								$('#video_wrapper').width()
							),
							this.percentage_to_px_vertical(
								points[i].y2,
								$('#video_wrapper').height()
							),
							xc,
							yc
						)
					}
					this.ctx.lineTo(
						this.percentage_to_px_vertical(
							points[points.length - 1].x2,
							$('#video_wrapper').width()
						),
						this.percentage_to_px_vertical(
							points[points.length - 1].y2,
							$('#video_wrapper').height()
						)
					)
					this.ctx.stroke()
				} else {
					this.roughCanvas.draw(roughElement)
				}
			}
		)
	},

	append_controls_to_triangle: function () {},

	show_current_annotation_with_time: function (id) {
		// setTimeout(() => {
		this.reset_annotation()
		this.annotation_panel.removeClass('hide')
		$('#annotation_canvas').addClass('pointer-events-none')
		$('#annotation_canvas').removeClass('hide')
		const current_annotation_obj = this.previous_annotation.find(
			item => item.comment_id == id
		)
		if (current_annotation_obj && current_annotation_obj.annotation) {
			this.shapes = current_annotation_obj.annotation
			this.initializ_canvas()
			current_annotation_obj.annotation.forEach((item, index) => {
				this.updatedElement(
					index,
					item.x1,
					item.y1,
					item.x2,
					item.y2,
					item.type,
					item.color
				)
			})
		}
	},

	hide_current_annotation_with_time: function () {
		$('#annotation_canvas').addClass('hide')
		$('#annotation_canvas').removeClass('darwingMode')
		$('#annotation_canvas').removeClass('pointer-events-none')
		this.ctx &&
			this.ctx.clearRect(
				0,
				0,
				this.annotation_canvas[0].width,
				this.annotation_canvas[0].height
			)
		this.shapes = []
		// $('#annotation_panel').remove()
		this.annotation_has_started = false

		$('.player-cta-button').removeClass('hide')
		$('#custom_captions_wrapper').removeClass('hide')
	},

	reset_annotation: function (hide_below_bar) {
		this.ctx &&
			this.ctx.clearRect(
				0,
				0,
				this.annotation_canvas[0].width,
				this.annotation_canvas[0].height
			)
		this.shapes = []
		$('#annotation_canvas').addClass('hide')
		this.handle_annotation.removeClass('active')
		this.currentColor = '#F73D72'
		this.currentTool = 'rectangle'
		if (hide_below_bar && this.annotation_has_started) {
			// $('#annotation_panel').remove()
			playerSettings.media.makePlayableCondition()
		}
	},

	// Attach window resize listener
	attachWindowResizeListener: function () {
		$('#video_wrapper')
			.resize(() => {
				if (!$('#annotation_canvas').hasClass('hide')) {
					$('#annotation_canvas').width($('#player').width())
					$('#annotation_canvas').height($('#player').height())
					$('#annotation_canvas')
						.off('mousemove')
						.off('mousedown')
						.off('mouseup')
					// this.ctx.lineWidth = 10;
					this.attach_event_listeners_to_canvas()
				}
			})
			.resize()
	},
}
