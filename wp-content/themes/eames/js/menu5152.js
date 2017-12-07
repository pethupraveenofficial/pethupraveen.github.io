
(function($) {
	var speed = 10;
	$('#pagenav li a, #main-mobile li a').on('click', function(e) {
   
              
		var _self = $(this);
			var _subMenu = _self.next('.sub-menu');
                          
			if (_subMenu.length) {
				e.preventDefault();
				if (_subMenu.is(':visible')) {
					_subMenu.slideUp(100);
                                

				} else {
					if (!_self.parent().is('.menu-item-has-children')) {
						$('.sub-menu:visible').slideUp(100);
                                           
					}
                          $('.sub-menu:visible').not($(this).parents()).slideUp(100);

					_subMenu.slideDown(100);

				}
				return false;
			}
		});

})(window.jQuery);

