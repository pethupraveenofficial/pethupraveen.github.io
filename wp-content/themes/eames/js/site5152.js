(function($) {
	var hasTouch = function() {
		return !!('ontouchstart' in window);
	};

	var thumbnailDisplay = $('#slide-thumbs').is(':visible');
	var jEvent = hasTouch() ? 'click' : 'click';

	var resizeByPercentage = function(value, percentage) {
		var newValue = parseInt(value * percentage, 10);
		return newValue;
	};

	var calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight, hasCaption, heightAllowance) {
		var newWidth = maxWidth,
			newHeight = maxHeight,
			isLandscape = true,
			percentage = 0,
			oldWidth = srcWidth,
			oldHeight = srcHeight;

		if (hasCaption === 0) {
			maxHeight += heightAllowance;
		}

		if (srcWidth > srcHeight) {
			// landscape
			newWidth = parseInt(maxWidth, 10);
			percentage = newWidth / srcWidth;
			newHeight = resizeByPercentage(srcHeight, percentage);
		} else {
			// portrait
			newHeight = parseInt(maxHeight, 10);
			percentage = newHeight / srcHeight;
			newWidth = resizeByPercentage(srcWidth, percentage);
			isLandscape = false;
		}

		// now let check if height is more than our max height.
		if (newHeight > maxHeight) {
			srcHeight = newHeight;
			newHeight = parseInt(maxHeight, 10);
			percentage = newHeight / srcHeight;
			newWidth = resizeByPercentage(newWidth, percentage);
		}

		if (srcWidth < newWidth || srcHeight < newHeight) {
			newWidth = oldWidth;
			newHeight = oldHeight;
			isLandscape = true;
		}

		return { width: newWidth, height: newHeight, landscape: isLandscape, hasCaption: hasCaption };
	};

	var onScreenResize = function() {
		var windowWidth = $(window).innerWidth() - 348;
		var windowHeight = $(window).innerHeight() - 120;
		var heightAllowanceCaption = 56;
		$('#gallery-start .gallery-photo img').each(function() {
			var imageDimension = calculateAspectRatioFit($(this).data('width'), $(this).data('height'), windowWidth, windowHeight, $(this).next('.caption').length, heightAllowanceCaption);
			$(this).css('width', imageDimension.width).css('height', imageDimension.height).css('max-width', 'none');

			if (imageDimension.landscape) {
				var _marginTop = parseInt((windowHeight - imageDimension.height) / 4, 10);
				if (imageDimension.hasCaption === 0) {
					if (imageDimension.height === windowHeight + heightAllowanceCaption) {
						_marginTop = 0;
					} else {
						_marginTop = parseInt((windowHeight - imageDimension.height) / 4, 10) + parseInt(heightAllowanceCaption / 2, 10);
					}
				}

				if (_marginTop > 0) {
					$(this).parent().css('height', imageDimension.height).find('img').css('margin-top', _marginTop);
				} else {
					$(this).parent().css('height', imageDimension.height);
				}
			}
		});

		//resize overlays (prev, next and thumbnails)
		var imageWrapperWidth = $('#gallery-wrap').outerWidth();

		var overlayThumbWidth = (20 / 100) * imageWrapperWidth;
		var overlaySideWidth = (40 / 100) * imageWrapperWidth;

		var slideThumbsWidth = (overlayThumbWidth + (overlaySideWidth * 2) + (windowWidth - imageWrapperWidth));

		$('#slide-thumbs').css('width', slideThumbsWidth);
		$('#gallery-start').css('width', slideThumbsWidth);
		$('.slide-overlays').css('width', slideThumbsWidth);

		var positionLoadingStatus = (slideThumbsWidth / 2) + 308;
		$('.loading-status').css('left', positionLoadingStatus);

		if ($('.responsive').is(':visible')) {
			$('.loading-status').css('display', 'none');
		}

	};

	onScreenResize();

	$(function() {
		if ($('#gallery-wrap').length) {
			$(document).on('keydown', null, 'left', function(e) {
				e.preventDefault();
				$('#slide-controls .prev').trigger('click');
			});

			$(document).on('keydown', null , 'right', function(e) {
				e.preventDefault();
				$('#slide-controls .next').trigger('click');
			});

			$(document).on('keydown', null, 'up down', function(e) {
				if ($('#slide-thumbs').is(':hidden')) {
					e.preventDefault();
					$('.show-thumbnails').trigger('click');
				}
			});

			if ($('.gallery-desc').length) {
				$('.gallery-desc').detach().appendTo('.sidebar').show().parent().addClass('gallery');
			}
		}

		if ($('#gallery-wrap').length) {
			$('body').addClass('loading');
		}

		onScreenResize();

		$('.openclicked').hide();

		$('.open').on(jEvent, function() {
			if ($("#main-mobile").is(':hidden')) {
				$("#main-mobile").slideDown().animate({
					queue: false,
					duration: 600,
					easing: ''
				});
				$('#linken').removeClass('open').addClass('openclicked');
			} else {
				$('#main-mobile').slideUp('fast');
				$('#linken').removeClass('openclicked').addClass('open');
			}
			return false;
		});

		$('img.lazy').lazyload();

		$('#main-mobile').on(jEvent, function(e) {
			e.stopPropagation();
		});

		if ($('.open').is(':visible') && $('#main-mobile').is(':visible')) {
			$('body').on('click touchstart', function() {
				$('#main-mobile').fadeOut('fast');
				$('#linken').removeClass('openclicked').addClass('open');
			});
		}

		if ($('.show-thumbnails').length) {
			$('#slide-thumbs .thumb-wrapper').css('opacity', 0);
			$('.show-thumbnails').on(jEvent, function(e) {
				e.preventDefault();
				$('#slide-controls').fadeOut('fast');
				$('.slide-overlays').hide();
				$('#gallery-start').fadeOut('fast', function() {
					$('#slide-thumbs').show().removeWhitespace().collagePlus({
						'fadeSpeed'           : 2000,
						'targetHeight'        : 280,
						'allowPartialLastRow' : true
					});
					$('#slide-thumbs').fadeIn('fast', function() {
						$(window).trigger('scroll');
					});
				});
			});

			$('#slide-thumbs img').on(jEvent, function() {
				$('#slide-thumbs').fadeOut('fast', function() {
					$('#gallery-start').fadeIn('fast');
					$('#slide-controls').fadeIn('fast');
					$('.slide-overlays').show();
				});
			});

			if ($('#slide-thumbs:visible').length) {
				$('#slide-controls').hide();
			}
		}

		if ($('#gallery-start .caption').length) {
			var elementTop = $('#top').height() + parseInt($('#top').css('top').replace('px', ''), 10) + 52;
			$('#gallery-start .caption').css('top', elementTop);
		}

		$('#gallery-start').on('cycle-next cycle-prev cycle-pager-activated', function() {
			$('#cursor').hide();
			if ($('.cycle-slide-active img').data('src') != $('.cycle-slide-active img').attr('src')) {
				$('.cycle-slide-active img').attr('src', $('.cycle-slide-active img').data('src'));
				$('.cycle-slide-active img').data('loaded', true);
				$('.cycle-slide-active').addClass('loading');
			}
		});

		$('#gallery-start').on('cycle-after', function(event, opts) {
			$('.slide-current-count').html(opts.slideNum);
			$('.slide-count').html(opts.slideCount);


			$('#cursor').hide();
			if ($('.cycle-slide-active img').data('src') != $('.cycle-slide-active img').attr('src')) {
				$('.cycle-slide-active img').attr('src', $('.cycle-slide-active img').data('src'));
				$('.cycle-slide-active img').data('loaded', true);
				$('.cycle-slide-active').addClass('loading');
			}
		});

		$('.slide-count').html($( '#gallery-start > div.cycle-slide' ).length);

	});

	var resizeTimer = null,
		screenResizeHndlr = null;

	$(window).resize(function() {
		if (screenResizeHndlr) {
			clearTimeout(screenResizeHndlr);
		}

		screenResizeHndlr = setTimeout(function() {
			if ($('.responsive').is(':hidden')) {
				onScreenResize();
			}

			clearTimeout(screenResizeHndlr);
		}, 200);

		if ($('.show-thumbnails').length) {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}

			$('#slide-thumbs .thumb-wrapper').css('opacity', 0);
			resizeTimer = setTimeout(function() {
				$('#slide-thumbs:visible').removeWhitespace().collagePlus({
					'fadeSpeed'           : 2000,
					'targetHeight'        : 280,
					'allowPartialLastRow' : true
				});
				clearTimeout(resizeTimer);
			}, 200);
		}
	});

	$('#gallery-wrap').hide();
	$(window).load(function() {
		$('body').removeClass('loading');
		$('.thumb-wrapper').css('background-color', '#fff');
		if ($('.responsive').is(':hidden')) {
			if ($('#gallery-wrap').length) {
				$('#gallery-wrap').fadeIn();
			}

			if ($('#slide-thumbs').is(':visible')) {
				$('#slide-thumbs').removeWhitespace().collagePlus({
					'fadeSpeed'           : 2000,
					'targetHeight'        : 280,
					'allowPartialLastRow' : true
				});

				$(window).trigger('scroll');
			} else {
				if ($('body').is('.page-template-page-portfolio-php')) {
					if ($('.slide-disabled').length === 0) {
						$('#slide-controls').show();
					}
				}
			}

			if ($('.slide-disabled').length) {
				$('#gallery-start').show();
				$('#gallery-start .gallery-photo').show();
			}
		}
	});

	return false;

})(window.jQuery);