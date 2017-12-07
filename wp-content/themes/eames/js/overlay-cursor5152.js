(function($) {
	var cursorElement;

	$(function() {
		cursorElement = $('#cursor');

		$('.slide-overlays .next').on('mouseenter mouseleave', function(e) {
			if (e.type == 'mouseenter') {
				cursorElement.addClass('icon-next');
			} else {
				cursorElement.removeClass('icon-next');
			}
		});

		$('.slide-overlays .prev').on('mouseenter mouseleave', function(e) {
			if (e.type == 'mouseenter') {
				cursorElement.addClass('icon-prev');
			} else {
				cursorElement.removeClass('icon-prev');
			}
		});

		$('.slide-overlays .show-thumbnails').on('mouseenter mouseleave', function(e) {
			if (e.type == 'mouseenter') {
				cursorElement.addClass('icon-thumb');
			} else {
				cursorElement.removeClass('icon-thumb');
			}
		});
	});

	var hasTouch = function() {
		return !!('ontouchstart' in window);
	};

	if (!hasTouch()) {
		$(window).mousemove(function(e){
			if (typeof cursorElement === 'undefined') {
				return false;
			}

			var overlayOffset = $('.slide-overlays').offset();

			if (typeof overlayOffset == 'undefined') {
				return false;
			}

			xPos = e.pageX - overlayOffset.left;
			yPos = e.pageY - overlayOffset.top;
			xLimit = $('.slide-overlays').width() - ($('#cursor').width() / 2);
			yLimit = $('.slide-overlays').height() - $('#cursor').height();

			if (xPos > 0 && yPos > 0 && xPos < xLimit && yPos < yLimit) {
				if (cursorElement.is(':hidden')) {
					cursorElement.show();
				}

				cursorElement.css({
					left: xPos,
					top: yPos
				});
			} else {
				cursorElement.hide();
			}
		});
	}
})(window.jQuery);