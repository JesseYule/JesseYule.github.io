// functions
function analytics(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-61249737-1', 'auto');
	ga('send', 'pageview');
}
      
function menuBtn(){
	(function($){
		$('#menu-btn').click(function(){
			$(document.body).toggleClass('menu-visible');
			$(this).toggleClass('active');
			return false;
		});
		
		$('#menu-btn').toggle(
			function(){
				$('#menu').fadeIn(200);
				$('#menu').addClass('menu-scale');
			},
			function(){
				$('#menu').fadeOut(200);
			}
		);
	})(jQuery);
}

function tile(){
	(function($) {
		$.fn.tile = function(columns) {
	    	var tiles, $tile, max, c, h, remove, s = document.body.style, a = ["height"],
		    last = this.length - 1;
		    if(!columns) columns = this.length;
		    remove = s.removeProperty ? s.removeProperty : s.removeAttribute;
		    return this.each(function() {
		    remove.apply(this.style, a);
		    }).each(function(i) {
		    c = i % columns;
		    if(c == 0) tiles = [];
		    $tile = tiles[c] = $(this);
		    h = ($tile.css("box-sizing") == "border-box") ? $tile.outerHeight() : $tile.innerHeight();
		    if(c == 0 || h > max) max = h;
		    if(i == last || c == columns - 1) {
		    $.each(tiles, function() { this.css("height", max); });
		    }
	    	});
		};
	})(jQuery);
}

function textFade(){
	(function ( $ ) {
	    $.fn.lbyl = function( options ) {
	        var s = $.extend({
	            content: '',
	            speed: 20,
	            type: 'fade',
	            fadeSpeed: 500,
	            finished: function(){}
	        }, options );
	        var elem = $(this),
	            letterArray = [],
	            lbylContent = s.content,
	            count = $(this).length;
	        elem.empty();
	        elem.attr('data-time', lbylContent.length * s.speed)                        
	        for (var i = 0; i < lbylContent.length; i++) {
	            letterArray.push(lbylContent[i]);
	        }  
	        $.each(letterArray, function(index, value) {
	        elem.append('<span style="display: none;">' + value + '</span>');	
	            setTimeout(function(){
	                if (s.type == 'show') {
	                    elem.find('span:eq(' + index + ')').show();
	                } else if (s.type == 'fade') {
	                   elem.find('span:eq(' + index + ')').fadeIn(s.fadeSpeed); 
	                }
	            }, index * s.speed);
	        });
	        setTimeout(function(){
	            s.finished();
	        }, lbylContent.length * s.speed); 
	    };
	}( jQuery ));
}

function pandaElements()
{
	(function( $ ) {
		var $win = $( window );
		var $doc = $( document );
		var $elements = $('.panda');
		var $areas = $('[data-panda-color]').not('.panda');
		
		var elements_top = [];
		var elements_bottom = [];
		var areas_top = [];
		
		init();
		
		function init()
		{
			createColors();
			
			if ( $areas.length > 0 ) {
				resize();
				$win.on('resize', onResize);
				$win.on('load scroll', onScroll);
				$doc.on('touchmove', onTouchMove);
			}
		}
		
		function createColors()
		{
			$elements.each(function( i, dom ){
				var html = $elements.eq(i).html();
				var colors = $elements.eq(i).data('panda-color').split(',');
				var len = colors.length;
				var j, $color;
				
				$elements.eq(i).empty();
				
				for ( j = 0; j < len; j ++ ) {
					$color = $(document.createElement('div')).addClass('color-' + colors[j]).appendTo( $elements.eq(i) );
					$(document.createElement('div')).addClass('color-inner').appendTo( $color ).html( html );
					$color.css({
						'height': 0
					});
				}
			});
		}
		
		function resize()
		{
			$elements.each(function(i){
				elements_top[ i ] = $elements.get(i).offsetTop;
				elements_bottom[ i ] = $elements.get(i).offsetTop + $elements.eq(i).innerHeight();
			});
			$areas.each(function(i){
				areas_top[ i ] = $areas.get(i).offsetTop;
			});
		}
		
		function check()
		{
			var top = $win.scrollTop();
			
			$elements.each(function( i ){
				checkElement( i, top );
			});
		}
		
		function checkElement( element, top )
		{
			var $element = $elements.eq( element );
			var element_top = elements_top[ element ];
			var element_bottom = elements_bottom[ element ];
			var area1 = 0;
			var area2 = 0;
			
			$areas.each(function( i ){
				if ( top + element_top > areas_top[ i ] ) {
					area1 = i;
				}
				if ( top + element_bottom > areas_top[ i ] ) {
					area2 = i;
				}
			});
			
			var color1 = $areas.eq(area1).data('panda-color');
			var color2 = $areas.eq(area2).data('panda-color');
			var color1_height = areas_top[ area2 ] - top - element_top;
			
			if ( color1 == color2 ) {
				$element.find('.color-' + color1).css({
					'height': '100%',
					'top': 0
				}).find('.color-inner').css({
					'top': 0
				});
				$element.find('[class^=color-]').not('.color-' + color1).not('.color-inner').css({
					'height': 0,
					'top': 0
				}).find('.color-inner').css({
					'top': 0
				});
			}
			else {
				$element.find('.color-' + color1).css({
					'height': color1_height,
					'top': 0
				}).find('.color-inner').css({
					'top': 0
				});
				$element.find('.color-' + color2).css({
					'height': (element_bottom - element_top - color1_height),
					'top': color1_height
				}).find('.color-inner').css({
					'top': - color1_height
				});
			}
		}
		
		function onResize(e)
		{
			resize();
		}
		
		function onScroll(e)
		{
			check();
		}
		
		function onTouchMove(e)
		{
			check();
		}
		
	})( jQuery );
}

function inviewElements()
{
	(function( $ ){
		var BUFF_PER = 0.4; // window高さを1とする
		var ACTIVE_CLASS = 'active';
		
		var $win = $( window );
		var $doc = $( document );
		var $elements = $('.inview');
		
		var scroll;
		var win_height;
		
		init();
		
		function init()
		{
			$win.on('load scroll resize', onScroll );
		}
		
		function onScroll(e)
		{
			scroll = $win.scrollTop();
			win_height = $win.innerHeight();
			
			$elements.each( check );
		}
		
		function check( i, dom )
		{
			var $element = $elements.eq(i);
			var top = $element.offset().top;
			var height = $element.innerHeight();
			
			/*
			if ( i == 0 ) {
				console.log( scroll, top, win_height, height, (scroll > top - win_height * BUFF_PER), (scroll < top + height) );
			}
			*/
			
			if ( scroll > top - win_height * BUFF_PER && scroll < top + height ) {
				$element.addClass( ACTIVE_CLASS );
				
				/*
				if ( i == 0 ) {
					console.log('add');
				}
				*/
			}
			/*
			else if ( $element.data('inview-repeat') ) {
				$element.removeClass( ACTIVE_CLASS );
				
				if ( i == 0 ) {
					console.log('remove');
				}
			}
			*/
		}
		
	})( jQuery );
}