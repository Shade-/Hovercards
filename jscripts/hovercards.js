/*!
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 */
var CanvasImage = function(a) {
	this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), document.body.appendChild(this.canvas), this.width = this.canvas.width = a.width, this.height = this.canvas.height = a.height, this.context.drawImage(a, 0, 0, this.width, this.height)
};
CanvasImage.prototype.clear = function() {
	this.context.clearRect(0, 0, this.width, this.height)
}, CanvasImage.prototype.update = function(a) {
	this.context.putImageData(a, 0, 0)
}, CanvasImage.prototype.getPixelCount = function() {
	return this.width * this.height
}, CanvasImage.prototype.getImageData = function() {
	return this.context.getImageData(0, 0, this.width, this.height)
}, CanvasImage.prototype.removeCanvas = function() {
	this.canvas.parentNode.removeChild(this.canvas)
};
var ColorThief = function() {};
/*!
 * quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
/*!
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (ColorThief.prototype.getColor = function(a, b) {
		var c = this.getPalette(a, 5, b),
			d = c[0];
		return d
	}, ColorThief.prototype.getPalette = function(a, b, c) {
		"undefined" == typeof b && (b = 10), ("undefined" == typeof c || 1 > c) && (c = 10);
		for (var d, e, f, g, h, i = new CanvasImage(a), j = i.getImageData(), k = j.data, l = i.getPixelCount(), m = [], n = 0; l > n; n += c) d = 4 * n, e = k[d + 0], f = k[d + 1], g = k[d + 2], h = k[d + 3], h >= 125 && (e > 250 && f > 250 && g > 250 || m.push([e, f, g]));
		var o = MMCQ.quantize(m, b),
			p = o ? o.palette() : null;
		return i.removeCanvas(), p
	}, !pv) var pv = {
	map: function(a, b) {
		var c = {};
		return b ? a.map(function(a, d) {
			return c.index = d, b.call(c, a)
		}) : a.slice()
	},
	naturalOrder: function(a, b) {
		return b > a ? -1 : a > b ? 1 : 0
	},
	sum: function(a, b) {
		var c = {};
		return a.reduce(b ? function(a, d, e) {
			return c.index = e, a + b.call(c, d)
		} : function(a, b) {
			return a + b
		}, 0)
	},
	max: function(a, b) {
		return Math.max.apply(null, b ? pv.map(a, b) : a)
	}
};
var MMCQ = function() {
	function a(a, b, c) {
		return (a << 2 * i) + (b << i) + c
	}

	function b(a) {
		function b() {
			c.sort(a), d = !0
		}
		var c = [],
			d = !1;
		return {
			push: function(a) {
				c.push(a), d = !1
			},
			peek: function(a) {
				return d || b(), void 0 === a && (a = c.length - 1), c[a]
			},
			pop: function() {
				return d || b(), c.pop()
			},
			size: function() {
				return c.length
			},
			map: function(a) {
				return c.map(a)
			},
			debug: function() {
				return d || b(), c
			}
		}
	}

	function c(a, b, c, d, e, f, g) {
		var h = this;
		h.r1 = a, h.r2 = b, h.g1 = c, h.g2 = d, h.b1 = e, h.b2 = f, h.histo = g
	}

	function d() {
		this.vboxes = new b(function(a, b) {
			return pv.naturalOrder(a.vbox.count() * a.vbox.volume(), b.vbox.count() * b.vbox.volume())
		})
	}

	function e(b) {
		var c, d, e, f, g = 1 << 3 * i,
			h = new Array(g);
		return b.forEach(function(b) {
			d = b[0] >> j, e = b[1] >> j, f = b[2] >> j, c = a(d, e, f), h[c] = (h[c] || 0) + 1
		}), h
	}

	function f(a, b) {
		var d, e, f, g = 1e6,
			h = 0,
			i = 1e6,
			k = 0,
			l = 1e6,
			m = 0;
		return a.forEach(function(a) {
			d = a[0] >> j, e = a[1] >> j, f = a[2] >> j, g > d ? g = d : d > h && (h = d), i > e ? i = e : e > k && (k = e), l > f ? l = f : f > m && (m = f)
		}), new c(g, h, i, k, l, m, b)
	}

	function g(b, c) {
		function d(a) {
			var b, d, e, f, g, h = a + "1",
				j = a + "2",
				k = 0;
			for (i = c[h]; i <= c[j]; i++)
				if (o[i] > n / 2) {
					for (e = c.copy(), f = c.copy(), b = i - c[h], d = c[j] - i, g = d >= b ? Math.min(c[j] - 1, ~~(i + d / 2)) : Math.max(c[h], ~~(i - 1 - b / 2)); !o[g];) g++;
					for (k = p[g]; !k && o[g - 1];) k = p[--g];
					return e[j] = g, f[h] = e[j] + 1, [e, f]
				}
		}
		if (c.count()) {
			var e = c.r2 - c.r1 + 1,
				f = c.g2 - c.g1 + 1,
				g = c.b2 - c.b1 + 1,
				h = pv.max([e, f, g]);
			if (1 == c.count()) return [c.copy()];
			var i, j, k, l, m, n = 0,
				o = [],
				p = [];
			if (h == e)
				for (i = c.r1; i <= c.r2; i++) {
					for (l = 0, j = c.g1; j <= c.g2; j++)
						for (k = c.b1; k <= c.b2; k++) m = a(i, j, k), l += b[m] || 0;
					n += l, o[i] = n
				} else if (h == f)
					for (i = c.g1; i <= c.g2; i++) {
						for (l = 0, j = c.r1; j <= c.r2; j++)
							for (k = c.b1; k <= c.b2; k++) m = a(j, i, k), l += b[m] || 0;
						n += l, o[i] = n
					} else
						for (i = c.b1; i <= c.b2; i++) {
							for (l = 0, j = c.r1; j <= c.r2; j++)
								for (k = c.g1; k <= c.g2; k++) m = a(j, k, i), l += b[m] || 0;
							n += l, o[i] = n
						}
			return o.forEach(function(a, b) {
				p[b] = n - a
			}), d(h == e ? "r" : h == f ? "g" : "b")
		}
	}

	function h(a, c) {
		function h(a, b) {
			for (var c, d = 1, e = 0; k > e;)
				if (c = a.pop(), c.count()) {
					var f = g(i, c),
						h = f[0],
						j = f[1];
					if (!h) return;
					if (a.push(h), j && (a.push(j), d++), d >= b) return;
					if (e++ > k) return
				} else a.push(c), e++
		}
		if (!a.length || 2 > c || c > 256) return !1;
		var i = e(a),
			j = 0;
		i.forEach(function() {
			j++
		});
		var m = f(a, i),
			n = new b(function(a, b) {
				return pv.naturalOrder(a.count(), b.count())
			});
		n.push(m), h(n, l * c);
		for (var o = new b(function(a, b) {
				return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume())
			}); n.size();) o.push(n.pop());
		h(o, c - o.size());
		for (var p = new d; o.size();) p.push(o.pop());
		return p
	}
	var i = 5,
		j = 8 - i,
		k = 1e3,
		l = .75;
	return c.prototype = {
		volume: function(a) {
			var b = this;
			return (!b._volume || a) && (b._volume = (b.r2 - b.r1 + 1) * (b.g2 - b.g1 + 1) * (b.b2 - b.b1 + 1)), b._volume
		},
		count: function(b) {
			var c = this,
				d = c.histo;
			if (!c._count_set || b) {
				var e, f, g, h = 0;
				for (e = c.r1; e <= c.r2; e++)
					for (f = c.g1; f <= c.g2; f++)
						for (g = c.b1; g <= c.b2; g++) index = a(e, f, g), h += d[index] || 0;
				c._count = h, c._count_set = !0
			}
			return c._count
		},
		copy: function() {
			var a = this;
			return new c(a.r1, a.r2, a.g1, a.g2, a.b1, a.b2, a.histo)
		},
		avg: function(b) {
			var c = this,
				d = c.histo;
			if (!c._avg || b) {
				var e, f, g, h, j, k = 0,
					l = 1 << 8 - i,
					m = 0,
					n = 0,
					o = 0;
				for (f = c.r1; f <= c.r2; f++)
					for (g = c.g1; g <= c.g2; g++)
						for (h = c.b1; h <= c.b2; h++) j = a(f, g, h), e = d[j] || 0, k += e, m += e * (f + .5) * l, n += e * (g + .5) * l, o += e * (h + .5) * l;
				k ? c._avg = [~~(m / k), ~~(n / k), ~~(o / k)] : c._avg = [~~(l * (c.r1 + c.r2 + 1) / 2), ~~(l * (c.g1 + c.g2 + 1) / 2), ~~(l * (c.b1 + c.b2 + 1) / 2)]
			}
			return c._avg
		},
		contains: function(a) {
			var b = this,
				c = a[0] >> j;
			return gval = a[1] >> j, bval = a[2] >> j, c >= b.r1 && c <= b.r2 && gval >= b.g1 && gval <= b.g2 && bval >= b.b1 && bval <= b.b2
		}
	}, d.prototype = {
		push: function(a) {
			this.vboxes.push({
				vbox: a,
				color: a.avg()
			})
		},
		palette: function() {
			return this.vboxes.map(function(a) {
				return a.color
			})
		},
		size: function() {
			return this.vboxes.size()
		},
		map: function(a) {
			for (var b = this.vboxes, c = 0; c < b.size(); c++)
				if (b.peek(c).vbox.contains(a)) return b.peek(c).color;
			return this.nearest(a)
		},
		nearest: function(a) {
			for (var b, c, d, e = this.vboxes, f = 0; f < e.size(); f++) c = Math.sqrt(Math.pow(a[0] - e.peek(f).color[0], 2) + Math.pow(a[1] - e.peek(f).color[1], 2) + Math.pow(a[2] - e.peek(f).color[2], 2)), (b > c || void 0 === b) && (b = c, d = e.peek(f).color);
			return d
		},
		forcebw: function() {
			var a = this.vboxes;
			a.sort(function(a, b) {
				return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color))
			});
			var b = a[0].color;
			b[0] < 5 && b[1] < 5 && b[2] < 5 && (a[0].color = [0, 0, 0]);
			var c = a.length - 1,
				d = a[c].color;
			d[0] > 251 && d[1] > 251 && d[2] > 251 && (a[c].color = [255, 255, 255])
		}
	}, {
		quantize: h
	}
}();

$.fn.afterTransition = function(callback) {
	return this.each(function() {
		var $this = $(this);
		$this.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEAnind oTransitionEnd MSTransitionEnd", function() {
			if (typeof callback == 'function') {
				callback.call(this); // brings the scope to the callback
			};
		});
	})

};

var Hovercards = {

	drops: [],
	usersCache: {},
	uid: null,
	inTimeout: null,
	outTimeout: null,
	counter: 0,
	delays: {
		appear: 0.4,
		disappear: 1
	},
	template: null,

	init: function(options) {

		// Disable on mobile devices
		if (Hovercards.utilities.isTouchDevice()) {
			return false;
		}

		this.options = $.extend({
			backgroundColor: null,
			dropPosition: 'bottom left'
		}, options);

		// Disable on click
		$('body').on('click', 'a[data-uid]', function() {

			// Disable this URL is inside the same hovercard - might happen
			if ($(this).closest('.drop').length) {
				return;
			}

			// Catch that running function just moments before its execution and kill it
			Hovercards.isActive = false;

			return Hovercards.visibilityHandler.hideAllHovercards();

		});

		$('body').on('mouseenter', 'a[data-uid]', function() {

			// Disable this URL is inside the same hovercard - might happen
			if ($(this).closest('.drop').length) {
				return false;
			}

			// Start again
			Hovercards.isActive = true;

			if (Hovercards.outTimeout !== null) {
				clearTimeout(Hovercards.outTimeout);
			}

			// If the target has already an active hovercard, stop
			if ($(this).hasClass('drop-enabled')) {
				return false;
			}

			var self = this;

			Hovercards.inTimeout = setTimeout(function() {

				var $self = $(self);

				Hovercards.counter++;

				// Set the internal user identifier
				Hovercards.uid = $self.attr('data-uid');

				Hovercards.visibilityHandler.hideAllHovercards();

				var target = self;
				var user = Hovercards.usersHandler.getCurrentUser();
				var deferred;

				// Set a unique ID on the target: will be used to eventually interrupt the display of this drop
				$self.data('hovercard', Hovercards.counter);

				if (!Hovercards.exists(user)) {

					// Gather all users identifiers on display, we are going to get their data in one single query
					var users = [];

					$('[data-uid]').each(function()  {

						var value = $(this).attr('data-uid');
						var parsedValue = parseInt(value);

						// This user is not present in 1) the query array and 2) the cache, add it
						if ($.isNumeric(value) && value > 0 && users.indexOf(parsedValue) < 0 && !Hovercards.exists(Hovercards.usersCache[parsedValue])) {
							return users.push(parsedValue);
						}

					});

					if (users) {

						// Preload all users relevant data
						deferred = $.ajax('xmlhttp.php', {

							data: {
								'action': 'hovercards',
								'uids': users
							}

						});

					}

				}

				$.when(deferred).then(function(data) {

					if (Hovercards.exists(data)) {

						$.each($.parseJSON(data), function(key, value) {
							return Hovercards.usersHandler.saveUserInCache(value);
						});

					}

					$.when(Hovercards.colorHandler.getDominantColor()).then(function() {
						return Hovercards.visibilityHandler.showHovercard(target, Hovercards.buildTemplate());
					});

				});

			}, Hovercards.delays.appear * 1000);

		}).on('mouseenter', '.drop-element', function(e) {

			if (Hovercards.outTimeout !== null) {
				return clearTimeout(Hovercards.outTimeout);
			}

		}).on('mouseleave', '.drop-element, *[data-uid]', function(e) {

			var id = $(this).data('hovercard') ? $(this).data('hovercard') : Hovercards.counter;

			if (Hovercards.inTimeout !== null) {
				clearTimeout(Hovercards.inTimeout);
			}

			Hovercards.outTimeout = setTimeout(function() {

				// Check the element being hovered
				var target = (e.relatedTarget) ? $(e.relatedTarget) : $(e.toElement);
				var targetClass = target.attr('class');

				if (Hovercards.exists(target) &&
					((Hovercards.exists(targetClass) &&
							targetClass.match(/\b(drop-element|drop-target)\b/)) ||
						target.parents('.drop-element, .drop-target').length > 0)) {
					return false;
				}

				return Hovercards.visibilityHandler.hideHovercard(id);

			}, Hovercards.delays.disappear * 1000);

		});

	},

	buildTemplate: function() {

		var user = Hovercards.usersHandler.getCurrentUser();

		if (!user) {
			return false;
		}

		var html = Hovercards.template;

		$.each(user, function(k, v) {

			// This is a dateline and should be processed
			if ($.isNumeric(v) && v.length == 10) {
				v = Hovercards.utilities.processDateline(v, k);
			}

			html = html.replace(new RegExp('{' + k + '}', 'g'), v);

		});

		return html;

	},

	visibilityHandler: {

		showHovercard: function(target, html) {

			if (!Hovercards.isActive || parseInt($(target).data('hovercard')) != Hovercards.counter) {
				return false;
			}

			var nextIndex = Hovercards.counter;

			// Delete old classes
			$(target).removeClass(function(index, className) {
				return (className.match(/(^|\s)drop-number-\S+/g) || []).join(' ');
			});

			Hovercards.drops[nextIndex] = new Drop({
				target: target,
				content: html,
				position: Hovercards.options.dropPosition,
				classes: 'drop-theme-hubspot-popovers drop-number-' + Hovercards.counter,
				openOn: 'always',
			});

			var background = (!Hovercards.options.backgroundColor) ? Hovercards.usersHandler.getCurrentUserProperty('dominant') : '#' + Hovercards.options.backgroundColor;

			// Fix horizontal positioning: https://github.com/HubSpot/drop/issues/16
			if (Hovercards.options.dropPosition.indexOf('center') < 0) {

				Hovercards.drops[nextIndex].on('open', () => positionDrop(Hovercards.drops[nextIndex]));

				function positionDrop(drop) {

					let dropWidth = drop.drop.getBoundingClientRect().width,
						left = drop.target.getBoundingClientRect().left,
						right = $(window).width() - left,
						direction = dropWidth > right ? 'right' : 'left';

					drop.tether.attachment.left = direction;
					drop.tether.targetAttachment.left = direction;
					drop.position();

				}

			}

			// Open the hovercard
			Hovercards.drops[nextIndex].position();
			Hovercards.drops[nextIndex].open();

			// Add the unique ID to the hovercard as well
			$('.drop-number-' + nextIndex).data('hovercard', nextIndex);

			// Update arrow positioning when the hovercard gets repositioned
			Hovercards.drops[nextIndex].tether.on('repositioned', function() {

				var position = ($(this.element).hasClass('drop-target-attached-bottom')) ? 'bottom' : 'top';

				// Stop if the position is the same as before
				if (position == this.hovercardsArrowPosition) {
					return false;
				}

				// Update the arrow position internally
				this.hovercardsArrowPosition = position;

				var bgcolor = (!Hovercards.options.backgroundColor) ? Hovercards.colorHandler.getNormalizedColor(
					Hovercards.usersHandler.getCurrentUserProperty('dominant')
				) : '#' + Hovercards.options.backgroundColor;

				// And finally visually as well
				return Hovercards.colorHandler.updateArrowColorAndPositioning(position, bgcolor, nextIndex);

			});

			// Add custom colors
			if (background) {

				var color = Hovercards.colorHandler.getComplementaryTextColor(background);
				var element = $(Hovercards.drops[nextIndex].content);
				var normalizedBackgroundColor = (!Hovercards.options.backgroundColor) ? Hovercards.colorHandler.getNormalizedColor(background) : background;

				element.css('background', normalizedBackgroundColor);
				element.css('color', color);

			}

			// Update arrow's color using inline styling
			if (normalizedBackgroundColor) {

				var position = ($(Hovercards.drops[nextIndex].drop).hasClass('drop-target-attached-bottom')) ? 'bottom' : 'top';

				// Add it to Tether, will be useful to compare it later on
				Hovercards.drops[nextIndex].tether.hovercardsArrowPosition = position;

				Hovercards.colorHandler.updateArrowColorAndPositioning(
					position,
					normalizedBackgroundColor
				);

			}

		},

		hideAllHovercards: function() {

			// Don't show anything in the queue
			if (Hovercards.inTimeout) {
				clearTimeout(Hovercards.inTimeout);
			}

			if (Hovercards.drops) {

				for (var i in Hovercards.drops) {

					if (Hovercards.drops.hasOwnProperty(i)) {
						Hovercards.visibilityHandler.hideHovercard(i);
					}

				}

			}

		},

		hideHovercard: function(i) {

			var target = Hovercards.drops[i];

			if (!Hovercards.exists(target)) {
				return false;
			}

			// Close this drop
			target.close();

			var deleteDrop = function() {

				if (Hovercards.exists(target.drop)) {

					try {
						target.destroy();
					} catch (e) {
						// Do nothing
					}

				}

				Hovercards.colorHandler.deleteArrowColorAndPositioning(i);

			};

			$(target.drop).afterTransition(deleteDrop);

			// Issue a cleanup handler if transitionend fails to fire
			setTimeout(deleteDrop, 500);

			return Hovercards.drops.splice(i, 1);

		}

	},

	usersHandler: {

		saveUserInCache: function(user) {

			if (!Hovercards.exists(user.uid)) {
				return false;
			}

			Hovercards.usersCache[user.uid] = user;

			return true;

		},

		saveUserPropertyInCache: function(propertyName, propertyValue) {

			if (!Hovercards.exists(Hovercards.uid)) {
				return false;
			}

			Hovercards.usersCache[Hovercards.uid][propertyName] = propertyValue;

			return true;

		},

		deleteUserFromCache: function(uid) {
			return Hovercards.usersCache.splice(uid, 1);
		},

		getUser: function(uid) {

			return (Hovercards.usersCache[uid]) ?
				Hovercards.usersCache[uid] :
				null;

		},

		getUserProperty: function(uid, property) {

			var user = Hovercards.usersHandler.getCurrentUser();

			return (Hovercards.exists(user) && Hovercards.exists(user[property])) ?
				user[property] :
				null;

		},

		getCurrentUser: function() {
			return Hovercards.usersHandler.getUser(Hovercards.uid);
		},

		getCurrentUserProperty: function(property) {
			return Hovercards.usersHandler.getUserProperty(Hovercards.uid, property);
		}

	},

	colorHandler: {

		getDominantColor: function() {

			return $.Deferred(function() {

				var self = this;
				var user = Hovercards.usersHandler.getCurrentUser();

				if (Hovercards.exists(user) && !Hovercards.exists(user.dominant) && Hovercards.exists(user.avatar) && !Hovercards.options.backgroundColor)  {

					// Get dominant color
					var image = new Image();
					image.crossOrigin = 'anonymous';

					// Use Google's open proxy to get the image data, given external sources might block CORS
					// requests (which does not happen on Google)

					if (user.avatar.indexOf('http') > -1) {
						image.src = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=300&url=' + encodeURIComponent(user.avatar);
					} else {
						image.src = user.avatar;
					}

					$(image).one('load', function() {

						var thief = new ColorThief();

						Hovercards.usersHandler.saveUserPropertyInCache('dominant', thief.getColor(image));

						return self.resolve();

					});

				} else {
					return self.resolve();
				}

			});

		},

		getComplementaryTextColor: function(rgb) {

			return ((((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000) >= 160) ?
				'rgba(0,0,0,.66)' :
				'#fff';

		},

		getNormalizedColor: function(rgb) {
			return 'rgb(' + rgb.join(', ') + ')';
		},

		updateArrowColorAndPositioning: function(direction, normalizedBackgroundColor, element) {

			if (element) {
				return $('#drop-arrow-' + element).replaceWith($('<style type="text/css" id="drop-arrow-' + element + '">.drop-number-' + element + ' .drop-content::before {border-' + direction + '-color: ' + normalizedBackgroundColor + '!important}</style>'));
			}

			return $('body').append($('<style type="text/css" id="drop-arrow-' + Hovercards.counter + '">.drop-number-' + Hovercards.counter + ' .drop-content::before {border-' + direction + '-color: ' + normalizedBackgroundColor + '!important}</style>'));
		},

		deleteArrowColorAndPositioning: function(id) {
			return $('#drop-arrow-' + id).remove();
		}

	},

	utilities: {

		isTouchDevice: function() {
			return (('ontouchstart' in window) || // HTML5 browsers
				(navigator.maxTouchPoints > 0) || // Future IE
				(navigator.msMaxTouchPoints > 0)); // Current IE10
		},

		processDateline: function(dateline, type) {

			if (!dateline || !Hovercards.exists(dateline)) {
				return false;
			} else {
				var date = new Date(dateline * 1000);
			}

			var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var today_midnight = new Date().setHours(0, 0, 0, 0) / 1000;
			var yesterday_midnight = today_midnight - (24 * 60 * 60);

			if (dateline > yesterday_midnight && dateline < today_midnight) {
				return 'Yesterday';
			} else if (dateline > today_midnight) {

				var delta = Math.round((new Date() - date) / 1000);
				var minute = 60;
				var hour = minute * 60;
				var day = hour * 24;
				var fuzzy;

				if (delta < (minute * 15) && type == 'lastactive') {
					return 'Online';
				}

				if (delta < 30) {
					fuzzy = 'Just now';
				} else if (delta < minute) {
					fuzzy = delta + ' seconds ago';
				} else if (delta < 2 * minute) {
					fuzzy = 'A minute ago';
				} else if (delta < hour) {
					fuzzy = Math.floor(delta / minute) + ' minutes ago';
				} else if (Math.floor(delta / hour) == 1) {
					fuzzy = '1 hour ago';
				} else if (delta < day) {
					fuzzy = Math.floor(delta / hour) + ' hours ago';
				} else {
					fuzzy = 'Today';
				}

				return fuzzy;

			}

			// Fixes https://www.mybboost.com/thread-regdate-field
			var toReturn = (date.getDate() + " " + month_names[date.getMonth()]);
			var dateYear = date.getUTCFullYear();

			if (new Date().getUTCFullYear() != dateYear) {
				toReturn += ' ' + dateYear;
			}

			return toReturn;

		}

	},

	exists: function(variable) {

		return (typeof variable !== 'undefined' && variable != null && variable) ?
			true :
			false;

	}

}