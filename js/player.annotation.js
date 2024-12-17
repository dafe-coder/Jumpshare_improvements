export function initializeAnnotation() {
	playerSettings.annotation = {
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

		initialize: function () {
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

		add_annotation_panel: function () {
			this.handle_annotation.unbind().bind('click', () => {
				playerSettings.annotation.first_time_clicked = true
				if (!$('#annotation_canvas').hasClass('hide')) {
					this.handle_annotation.removeClass('ann_active')
					$('#annotation_canvas').addClass('hide')
					this.ctx &&
						this.ctx.clearRect(
							0,
							0,
							this.annotation_canvas[0].width,
							this.annotation_canvas[0].height
						)
					this.currentColor = '#F73D72'
					this.currentTool = 'rectangle'
					// $('#annotation_panel').remove()
					this.shapes = []
					playerSettings.annotation.shapes.splice(
						0,
						playerSettings.annotation.shapes.length
					)
				} else {
					this.handle_annotation.addClass('ann_active')
					$('#annotation_canvas').removeClass('hide')
					this.attach_annotation_panel()
					// $('#comments_activity').slideDown(100)
					// $('#show-annotation').css('bottom', '7px')
					// $('#comment_person_icon').css('bottom', '14px')

					setTimeout(function () {
						player.pause()
					}, 10)
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
			$('#custom_captions_wrapper').addClass('hide')
			$('.controls-comments').addClass('hide')
			// $('#time_stmp_coments_wrpr').addClass('stick_to_bottom')
		},

		show_seekbar_and_timed_comments: function () {
			player.pause()
			$('.controls').addClass('active')
			$('.player-cta-button').removeClass('hide')
			$('#custom_captions_wrapper').removeClass('hide')
			$('.controls-comments').removeClass('hide')
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

			let _x1 = this.percentage_to_px_horizontal(
				x1,
				$('#video_wrapper').width()
			)
			let _y1 = this.percentage_to_px_vertical(y1, $('#video_wrapper').height())
			let _x2 = this.percentage_to_px_horizontal(
				x2,
				$('#video_wrapper').width()
			)
			let _y2 = this.percentage_to_px_vertical(y2, $('#video_wrapper').height())
			let arrowDawan = false
			if (this.annotation_canvas[0]) {
				if (type === 'line') {
					roughElement = this.generator.line(_x1, _y1, _x2, _y2, {
						roughness: 0,
						stroke: color,
						strokeWidth: 4,
					})
					return { id, x1, y1, x2, y2, type, roughElement, color }
				} else if (type === 'rectangle') {
					roughElement = this.generator.rectangle(
						_x1,
						_y1,
						_x2 - _x1,
						_y2 - _y1,
						{ roughness: 0, stroke: color, strokeWidth: 4 }
					)
					return { id, x1, y1, x2, y2, type, roughElement, color }
				} else if (type === 'arrow') {
					const angle = Math.atan2(_y2 - _y1, _x2 - _x1)
					const headLength = 10
					roughElement = `M ${_x1} ${_y1} L ${_x2} ${_y2}`

					roughElement += `M ${_x2} ${_y2} L ${_x2 - headLength * Math.cos(angle - Math.PI / 6)} ${_y2 - headLength * Math.sin(angle - Math.PI / 6)}`
					roughElement += `M ${_x2} ${_y2} L ${_x2 - headLength * Math.cos(angle + Math.PI / 6)} ${_y2 - headLength * Math.sin(angle + Math.PI / 6)}`

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
				playerSettings.annotation.get_distance(a, b) -
				(playerSettings.annotation.get_distance(a, c) +
					playerSettings.annotation.get_distance(b, c))
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
			} else if (type === 'line') {
				const a = { x: x1, y: y1 }
				const b = { x: x2, y: y2 }
				const c = { x, y }
				const offset =
					playerSettings.annotation.get_distance(a, b) -
					(playerSettings.annotation.get_distance(a, c) +
						playerSettings.annotation.get_distance(b, c))
				return Math.abs(offset) < 1
			} else if (type === 'arrow') {
				const a = { x: x1, y: y1 }
				const b = { x: x2, y: y2 }
				const c = { x, y }
				const offset =
					playerSettings.annotation.get_distance(a, b) -
					(playerSettings.annotation.get_distance(a, c) +
						playerSettings.annotation.get_distance(b, c))
				return Math.abs(offset) < 1
			} else if (type === 'freehand') {
				const betweenAnyPoint = element.points.some((point, index) => {
					const nextPoint = element.points[index + 1]
					if (!nextPoint) return false
					return (
						playerSettings.annotation.is_on_the_line(
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
				// const _updatedElement = playerSettings.annotation.create_new_element(id, x1, y1, x2, y2, type, color);
				this.shapes[id].points = [...this.shapes[id].points, { x2, y2 }]
				this.render()
			} else {
				const _updatedElement = playerSettings.annotation.create_new_element(
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

				this.ctx.lineWidth = 2
				this.ctx.strokeStyle = this.currentColor
				this.ctx.lineJoin = 'round'
				this.ctx.lineCap = 'round'
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

						const element = getElementAtPosition(
							_offsetX,
							_offsetY,
							this.shapes
						)
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

						const element = playerSettings.annotation.create_new_element(
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

						const element = getElementAtPosition(
							_offsetX,
							_offsetY,
							this.shapes
						)
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
						this.roughCanvas.path(roughElement, {
							roughness: 0,
							stroke: color,
							strokeWidth: 4,
						})
					} else if (type === 'freehand') {
						this.ctx.beginPath()
						this.ctx.lineWidth = 4
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
			$('#resume_the_video').remove()
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
			$('#annotation_canvas').removeClass('darwingMode')
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
			this.handle_annotation.removeClass('ann_active')
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
}
