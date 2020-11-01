$(function() {

	$('.has-submenu > a').on('click', function() {
		$(this).parent().toggleClass('opened');
	});

	$('.open-catalog-btn').on('click', function() {
		let ths = $(this);
		if ( $('.catalog-window').is(':visible') ) {
			$('.catalog-window').fadeOut(400);
			$('.bg-overlay').fadeOut(400);
			setTimeout(() => {
				ths.removeClass('active');
			}, 400)
		}
		else {
			$('.catalog-window').fadeIn(400);
			$('.bg-overlay').fadeIn(400);
			ths.addClass('active');
		}
	});

	$('.bg-overlay').on('click', function() {
		$('.catalog-window').fadeOut(400);
		$('.bg-overlay').fadeOut(400);
		setTimeout(() => {
			$('.open-catalog-btn').removeClass('active');
		}, 400)
	});

	$('.catalog-window-link').hover(function() {
		let ths = $(this),
				id = ths.attr('href');
		if ( $(id).is(':hidden') ) {
			$('.catalog-window-link').removeClass('active');
			ths.addClass('active');
			$('.catalog-window-items-tab').hide().removeClass('visible');
			$(id).show();
			setTimeout(() => {
				$(id).addClass('visible');
			}, 50)
		}
	});

	function openSearch() {
		let searchDrop = $('.search-dropdown');
		$('.search-btn').addClass('active')
		searchDrop.show();
		setTimeout(() => {
			searchDrop.addClass('opened')
		}, 50)
	}

	function closeSearch() {
		let searchDrop = $('.search-dropdown');
		$('.search-btn').removeClass('active');
		searchDrop.removeClass('opened');
		setTimeout(() => {
			searchDrop.hide()
		}, 400)
	}

	$('.search-btn').on('click', function(e) {
		e.preventDefault();
		if ( $('.search-dropdown').is(':hidden') ) {
			openSearch();
		}
		else {
			closeSearch();
		}
	});

	$('.header-search .search-input').on('input', function() {
		if ( $(this).val().trim().length !== 0 ) {
			openSearch();
		}
		else {
			closeSearch()
		}
	});

	let bannerThumbNmb = 0,
			bannerQnt = $('.main-banner-slider-thumb').length,
			canClickThumb = true;

	let bannerInterval = setInterval(() => {
		startBannerSlider(bannerThumbNmb)
	}, 5000);

	function startBannerSlider(qnt) {
		if ( bannerThumbNmb < bannerQnt ) {
			$('.main-banner-slider-thumb').removeClass('active');
			$('.main-banner-slider-thumb').eq(qnt).addClass('active');
			$('.main-banner-slide.visible').addClass('absolute');
			setTimeout(() => {
				$('.main-banner-slide.visible').each(function() {
					if ( $(this).index() != qnt ) {
						$(this).hide().removeClass('absolute visible');
					}
				});
				canClickThumb = true;
			}, 450);
			$('.main-banner-slide').eq(qnt).show();
			setTimeout(() => {
				$('.main-banner-slide').eq(qnt).addClass('visible')
			}, 50);
			if ( bannerThumbNmb == bannerQnt - 1 ) {
				bannerThumbNmb = 0
			}
			else {
				bannerThumbNmb++;
			}
		}
	}startBannerSlider(bannerThumbNmb);

	$('.main-banner-slider-thumb').on('click', function() {
		let ths = $(this),
				ind = ths.index();
		if ( $('.main-banner-slide').eq(ind).is(':hidden') && canClickThumb ) {
			bannerThumbNmb = ind;
			clearInterval(bannerInterval);
			startBannerSlider(ind);
			bannerInterval = setInterval(() => {
				startBannerSlider(bannerThumbNmb)
			}, 5000);
			canClickThumb = false;
		}
	});

	$('.counter').each(function() {
		let timer = $(this),
				hour_block = timer.find('.counter-hours'),
				minute_block = timer.find('.counter-minutes'),
				second_block = timer.find('.counter-seconds'),
				time = parseInt(timer.data('count')),
				time_hour = 0;
				time_minute = 0;
				time_second = 0;
		function timerCounter() {
			if ( time > 0 ) {
				time--;
				time_hour = parseInt(time / 60 / 60);
				time_minute = parseInt( ( time - ( time_hour * 60 * 60 ) ) / 60 );
				time_second = time - ( time_hour * 60 * 60 ) - ( time_minute * 60 );
				if ( time_hour.toString().length < 2 ) {
					hour_block.text('0' + time_hour);
				} else {
					hour_block.text(time_hour);
				}
				if ( time_minute.toString().length < 2 ) {
					minute_block.text('0' + time_minute);
				} else {
					minute_block.text(time_minute);
				}
				if ( time_second.toString().length < 2 ) {
					second_block.text('0' + time_second);
				} else {
					second_block.text(time_second);
				}
			}
		}timerCounter();
		setInterval(timerCounter, 1000);
	});

	$('.products-slider').owlCarousel({
		items: 5,
		margin: 50,
		nav: true,
		dots: false
	});

	$('.products-slider-with-category').owlCarousel({
		items: 4,
		margin: 50,
		nav: true,
		dots: false
	});

	function checkNavSwitchPos() {
		$('.tabs-nav').each(function() {
			let ths = $(this),
					switchNav = ths.find('.switch-border'),
					link = ths.find('.tabs-nav-link.active'),
					leftOffset = link.offset().left - ( $(window).width() - ths.width() ) / 2 + parseFloat(ths.css('padding-left'));
			switchNav.css({
				'-webkit-transform': `translate3d(${leftOffset}px, 0, 0)`,
				'transform': `translate3d(${leftOffset}px, 0, 0)`,
				'width': `${link.outerWidth()}px`
			})
		});
	}checkNavSwitchPos();

	let tabSlider = $('.tabs-nav-slider');
	$('.tabs-nav-slider').owlCarousel({
		items: 10,
		autoWidth: true,
		nav: true,
		dots: false,
		mouseDrag: false,
		onTranslated: function() {
			checkNavSwitchPos();
		},
		onInitialized: function() {
			checkNavSwitchPos()
		}
	});

	$('.tabs-nav-link').on('click', function(e) {
		e.preventDefault();
		let ths = $(this),
				mainParent = $('.tabs-wrapper'),
				tabs = mainParent.find('.tabs-item'),
				currentTab = mainParent.find(`.tabs-item[data-tab='${ths.data('tab')}']`);
		if ( currentTab.is(':hidden') ) {
			ths.parents('.tabs-nav').find('.tabs-nav-link').removeClass('active');
			ths.addClass('active');
			checkNavSwitchPos();
			tabs.hide();
			currentTab.fadeIn(400);
		}
		// ths.parents('.tabs-nav-slider').trigger('to.owl.carousel', ths.parents('.owl-item').index());
	});

	$('.product-slider-custom').owlCarousel({
		items: 5,
		dots: false,
		nav: true,
		margin: 40
	});

	let prints = document.querySelectorAll('.print-stencils-item'),
			dropArea = document.querySelector('.print-tshirt-drop-area'),
			imgAltAttr = '',
			imgSrcAttr = '';

	dropArea.ondrop = e => {
		e.preventDefault();
	  let data = e.target;
	  dropArea.innerHTML = '';
	  dropArea.innerHTML = `<img src="${imgSrcAttr}" alt="${imgSrcAttr}" draggable="false" />`;
	}

	dropArea.ondragover = e => {
		e.preventDefault()
	}

	prints.forEach(print => {

		print.ondragstart = e => {
			let data = e.target.querySelector('img'),
					attrSrc = data.getAttribute('src'),
					attrAlt = data.getAttribute('alt');
			imgAltAttr = attrAlt;
			imgSrcAttr = attrSrc;
		}

	});

	let accordionSlider = $('.accordion-slider');

	accordionSlider.owlCarousel({
		items: 1,
		nav: true,
		dots: false,
		margin: 10,
		mouseDrag: false
	});

	accordionSlider.on('translated.owl.carousel', function(e) {
		let currIndex = e.item.index;
		if ( $('.accordion-item.active').index() !== currIndex ) {
			let needAccordion = $('.accordion-item').eq(currIndex);
			$('.accordion-item').each(function(i) {
				let ths = $(this);
				if ( i !== currIndex ) {
					ths.removeClass('active').find('.accordion-body').slideUp(400);
				}
			});
			needAccordion.addClass('active');
			needAccordion.find('.accordion-body').slideDown(400);
			setTimeout(() => {
				checkAccordionSwitchPos();
			}, 400);
		}
	});

	$('.accordion-title').on('click', function() {
		let ths = $(this),
				accordionParent = ths.parents('.accordion-item'),
				ind = accordionParent.index(),
				accordionBody = accordionParent.find('.accordion-body');
		if ( !accordionParent.hasClass('active') ) {
			$('.accordion-item').each(function(i) {
				let ths = $(this);
				if ( i !== ind ) {
					ths.removeClass('active').find('.accordion-body').slideUp(400);
				}
			});
			accordionParent.addClass('active');
			accordionBody.slideDown(400);
			setTimeout(() => {
				checkAccordionSwitchPos();
			}, 400);
			accordionSlider.trigger('to.owl.carousel', ind);
		}
	});

	function checkAccordionSwitchPos() {
		$('.accordion').each(function() {
			let ths = $(this),
					switchNav = ths.find('.accordion-switch'),
					link = ths.find('.accordion-item.active'),
					topOffset = link.position().top;
			switchNav.css({
				'-webkit-transform': `translate3d(0, ${topOffset}px, 0)`,
				'transform': `translate3d(0, ${topOffset}px, 0)`,
				'height': `${link.outerHeight()}px`
			})
		});
	}checkAccordionSwitchPos();

	$('.product-liked-btn').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
	});

	$(window).on('resize', function() {
		checkNavSwitchPos();
		checkAccordionSwitchPos();
	});

	$(document).on('click', function(e) {
		if ( !$(e.target).closest('.has-submenu').length ) {
			$('.has-submenu').removeClass('opened')	
		}
		if ( !$(e.target).closest('.header-search').length ) {
			closeSearch()
		}
	});

});
