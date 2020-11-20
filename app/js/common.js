$(function() {

	jQuery.event.special.touchstart = {
		setup: function( _, ns, handle ){
			if ( ns.includes("noPreventDefault") ) {
				this.addEventListener("touchstart", handle, { passive: false });
			} else {
				this.addEventListener("touchstart", handle, { passive: true });
			}
		}
	};

	let isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	const touchPrevent = e => {
		e.preventDefault();
	}

	function bodyNoScroll() {
		$('body').addClass('mob-no-scroll');
  	document.addEventListener('touchmove', touchPrevent, { passive: true });
	}

	function bodyHasScroll() {
		$('body').removeClass('mob-no-scroll');
  	document.removeEventListener('touchmove', touchPrevent, { passive: true });
	}

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
			}, 400);
			$('.header-mobile-universal-close').removeClass('visible');
			bodyHasScroll();
		}
		else {
			$('.catalog-window').fadeIn(400);
			$('.bg-overlay').fadeIn(400);
			ths.addClass('active');
			$('.header-mobile-universal-close').addClass('visible');
			bodyNoScroll();
			if ( $(window).width() < 576 ) {
				$('html, body').scrollTop(0);
			}
		}
	});

	$('.bg-overlay').on('click', function() {
		$('.catalog-window').fadeOut(400);
		$('.bg-overlay').fadeOut(400);
		setTimeout(() => {
			$('.open-catalog-btn').removeClass('active');
		}, 400);
		closeAccDropdown();
	});

	$('.catalog-window-link').hover(function() {
		if ( isMobile.any() == null ) {
			let ths = $(this),
					id = ths.data('tab');
			if ( $(id).is(':hidden') ) {
				$('.catalog-window-link').removeClass('active');
				ths.addClass('active');
				$('.catalog-window-items-tab').hide().removeClass('visible');
				$(id).show();
				setTimeout(() => {
					$(id).addClass('visible');
				}, 50)
			}
		}
	});

	$('.catalog-window-link').on('click', function(e) {
		if ( isMobile.any() ) {
			e.preventDefault();
			let ths = $(this),
					id = ths.data('tab');
			if ( $(id).is(':hidden') ) {
				$('.catalog-window-link').removeClass('active');
				ths.addClass('active');
				$('.catalog-window-items-tab').hide().removeClass('visible');
				$(id).show();
				setTimeout(() => {
					$(id).addClass('visible');
				}, 50)
			}
		}
	});

	$('.catalog-window-items-nav .h5 a').on('click', function(e) {
		if ( $(window).width() < 576 ) {
			let parent = $(this).parents('.catalog-window-items-nav'),
					list = parent.find('.catalog-window-items-list');
			if ( list.length != 0 ) {
				e.preventDefault();
				$('.catalog-window-mob-subcat-back').text('').text( $(this).text() );
				$('.catalog-window-mob-subcat-body').html('').append( list.clone() );
				$('.catalog-window-mob-subcat').addClass('opened');
			}
		}
	});

	$('.catalog-window-mob-subcat-header').on('click', function() {
		$('.catalog-window-mob-subcat').removeClass('opened');
	});

	function openSearch() {
		let searchDrop = $('.search-dropdown');
		$('.search-btn').addClass('active')
		searchDrop.show();
		setTimeout(() => {
			searchDrop.addClass('opened')
		}, 50);
		$('.search-input-wrapper').addClass('opened');
	}

	function closeSearch() {
		let searchDrop = $('.search-dropdown');
		$('.search-btn').removeClass('active');
		searchDrop.removeClass('opened');
		setTimeout(() => {
			searchDrop.hide()
		}, 400);
		$('.search-input-wrapper').removeClass('opened');
	}

	$('.header-search .search-btn').on('click', function(e) {
		e.preventDefault();
		if ( !$('.search-dropdown').hasClass('opened') ) {
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

	$('.catalog-window-search .search-input').on('focusin', function() {
		$('.catalog-window').hide();
		$('.bg-overlay').hide();
		$('.open-catalog-btn').removeClass('active');
		$('.header-search .search-input').focus();
	});

	let bannerThumbNmb = 0,
			bannerQnt = $('.main-banner-slider-thumb').length,
			canClickThumb = true,
			bannerSlider = $('.main-banner-slider');

	let bannerInterval = setInterval(() => {
		startBannerSlider(bannerThumbNmb)
	}, 5000);

	function initBannerSlider() {
		if ( $(window).width() < 768 ) {
			bannerSlider.addClass('owl-carousel').owlCarousel({
				items: 1,
				loop: true,
				nav: false,
				dots: true,
				margin: 15,
				responsive: {
					0: {
						margin: 0
					},
					576: {
						margin: 15
					}
				}
			});
		}
		else {
			bannerSlider.trigger('destroy.owl.carousel').removeClass('owl-carousel');
		}
	}initBannerSlider();

	function startBannerSlider(qnt) {
		if ( bannerThumbNmb < bannerQnt && $(window).width() >= 768 ) {
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
		dots: false,
		responsive: {
			0: {
				items: 2,
				margin: 20,
			},
			768: {
				items: 3,
				margin: 20,
			},
			1200: {
				items: 4,
				margin: 30,
			},
			1366: {
				items: 5,
				margin: 50,
			}
		}
	});

	$('.products-slider-with-category').owlCarousel({
		items: 4,
		margin: 50,
		nav: true,
		dots: false,
		responsive: {
			0: {
				items: 2,
				margin: 20,
			},
			768: {
				items: 3,
				margin: 20,
			},
			1366: {
				items: 4,
				margin: 50,
			}
		}
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
	});

	$('.product-slider-custom').owlCarousel({
		items: 5,
		dots: false,
		nav: true,
		margin: 40,
		responsive: {
			0: {
				items: 2,
				margin: 15
			},
			768: {
				items: 3,
				margin: 20
			},
			1200: {
				items: 4,
				margin: 20
			},
			1366: {
				items: 5,
				margin: 40
			}
		}
	});

	let prints = document.querySelectorAll('.print-stencils-item'),
			dropArea = document.querySelector('.print-tshirt-drop-area'),
			imgAltAttr = '',
			imgSrcAttr = '';

	if ( dropArea ) {

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

	}

	let accordionSlider = $('.accordion-slider'),
			accordionMobSlider = $('.accordion-list');

	$('.accordion-item').each(function() {
		let img = $(this).find('.accordion-img-for-slider img');
		accordionSlider.append(img.clone());
	});

	function activateAccordionMobSlider() {
		if ( $(window).width() < 992 ) {
			accordionMobSlider.addClass('owl-carousel').owlCarousel({
				items: 2,
				autoWidth: true,
				margin: 20,
				nav: false,
				dots: false,
				responsive: {
					0: {
						autoWidth: false,
						items: 1,
					},
					768: {
						autoWidth: true,
						items: 2
					}
				}
			});
		}
		else {
			accordionMobSlider.trigger('destroy.owl.carousel').removeClass('owl-carousel');
		}
	}activateAccordionMobSlider();
	
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
		if ( $(window).width() >= 992 ) {
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

	$('.product-liked-btn, .product-list-view-liked').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
	});

	$('.auth-form-nav-link').on('click', function(e) {
		e.preventDefault();
		let tab = $(this).data('tab'),
				form = $(this).parents('.auth-form'),
				needTab = form.find(`.auth-form-tab[data-tab="${tab}"]`);
		if ( needTab.is(':hidden') ) {
			form.find('.auth-form-nav-link').removeClass('active');
			$(this).addClass('active');
			form.find('.auth-form-tab').hide();
			needTab.fadeIn(400);
		}
	});

	$('.phone-mask').inputmask({
  	mask: "+7 999 999-99-99",
  	showMaskOnHover: false
  });

  $('.card-mask').inputmask({
  	mask: "9999 9999 9999 9999",
  	showMaskOnHover: false
  });

  function openPopup(id) {
  	let notCurrentPopups = $(`.popup-wrapper:not(${id})`);
  	notCurrentPopups.removeClass('opened');
  	setTimeout(() => {
  		notCurrentPopups.hide()
  	}, 400);
  	$(id).show();
  	setTimeout(() => {
  		$(id).addClass('opened')
  	}, 50);
  	bodyNoScroll();
  }

  function closePopup(e) {
  	e.preventDefault();
  	$('.popup-wrapper').removeClass('opened');
  	setTimeout(() => {
  		$('.popup-wrapper').hide()
  	}, 400);
  	bodyHasScroll();
  	$('.header-mobile-universal-close').removeClass('visible');
  }

  $('.open-popup').on('click', function(e) {
  	e.preventDefault();
  	let id = $(this).attr('href');
  	openPopup(id);
  });

  $('.popup-close, .popup-bg, .close-popup').on('click', closePopup);

  let minOneLoop = false; 

  function adaptiveHeader() {
  	if ( $(window).width() >= 992 ) {
	  	let headerContentWidth = 0;
	  	$('.header-top-row > div:visible').each(function() {
	  		headerContentWidth += $(this).outerWidth(true);
	  	});
	  	if ( ( headerContentWidth + parseFloat($('.header-top').css('padding-left')) * 2 - 15 ) > $(window).width() ) {
	  		minOneLoop = true;
	  		for ( let i = $('.header-menu > ul > li').length - 1; i--; i >= 0 ) {
	  			let ths = $('.header-menu > ul').find('> li').eq(i);
	  			headerContentWidth = 0;
	  			$('.header-top-row > div:visible').each(function() {
	  				headerContentWidth += $(this).outerWidth(true);
	  			});
	  			if ( ( headerContentWidth + parseFloat($('.header-top').css('padding-left')) * 2 - 15 ) > $(window).width() && !ths.hasClass('has-submenu') ) {
	  				ths.appendTo('.header-menu .submenu').addClass('insert-li')
	  			}
	  		}
	  	}
	  	else if ( minOneLoop ) {
	  		minOneLoop = false;
	  		$('.submenu').find('.insert-li').each(function() {
	  			let ths = $(this),
	  					thsHtml = ths.html();
	  			ths.removeClass('insert-li').remove();
	  			$('.has-submenu').before(`<li>${thsHtml}</li>`);
	  			if ( ( headerContentWidth + parseFloat($('.header-top').css('padding-left')) * 2 - 15 ) > $(window).width() ) {
			  		for ( let i = $('.header-menu > ul > li').length - 1; i--; i >= 0 ) {
			  			let ths = $('.header-menu > ul').find('> li').eq(i);
			  			headerContentWidth = 0;
			  			$('.header-top-row > div:visible').each(function() {
			  				headerContentWidth += $(this).outerWidth(true);
			  			});
			  			if ( ( headerContentWidth + parseFloat($('.header-top').css('padding-left')) * 2 - 15 ) > $(window).width() && !ths.hasClass('has-submenu') ) {
			  				ths.appendTo('.header-menu .submenu').addClass('insert-li')
			  			}
			  		}
			  	}
	  		});
	  		adaptiveHeader()
	  	}
  	}
  }adaptiveHeader();

  $('.open-mob-menu').on('click', function() {
  	$('.header-top').addClass('opened');
  	$('.header-mobile-universal-close').removeClass('visible');
  	if ( $(window).width() < 576 ) {
  		bodyNoScroll();
  	}
  });

  $('.header-mob-close').on('click', function() {
  	$('.header-top').removeClass('opened');
  	$('.header-acc').removeClass('visible');
  	$('.header-mobile-universal-close').removeClass('visible');
  	if ( $(window).width() < 576 ) {
  		bodyHasScroll();
  	}
  });

  $('.profile-link').on('click', function(e) {
  	e.preventDefault();
  	if ( $('.header-user').length != 0 ) {
  		$('.header-acc').addClass('visible');
  		$('.header-mobile-universal-close').addClass('visible');
  		$('html, body').scrollTop(0);
  		if ( $(window).width() < 576 ) {
  			bodyNoScroll();
  		}
  	}
  	else {
  		openPopup('#auth-popup');
  	}
  });

  
  $('.print-stencils-item').on('click', function() {
  	if ( isMobile.any() ) {
  		let thsImg = $(this).html();
  		$('.print-tshirt-drop-area').html(thsImg);
  	}
  });

  $('.img-uploader').on('change', function(e) {
  	let file = $(this)[0].files[0],
  			fileReader = new FileReader();
  	if ( file.type.startsWith('image/') ) {
  		fileReader.onload = function(e) {
  			$('.print-tshirt-drop-area').html(`<img src="${e.target.result}" alt="" />`)
  		}
  		fileReader.readAsDataURL(file)
  	}
  	else {
  		alert('Выбран не правильный формат изображения!');
  	}
  });

  let advRow = $('.adv-row');

  function initAdvSlider() {
  	if ( $(window).width() < 768 ) {
  		advRow.addClass('owl-carousel').owlCarousel({
  			items: 5,
  			margin: 20,
  			nav: false,
  			dots: false,
  			responsive: {
  				0: {
  					items: 3
  				},
  				420: {
  					items: 4
  				},
  				576: {
  					items: 5
  				}
  			}
  		})
  	}
  	else {
  		advRow.trigger('destroy.owl.carousel').removeClass('owl-carousel');
  	}
  }initAdvSlider();

  $('.catalog-window-tab-header').on('click', function(e) {
  	e.preventDefault();
  	let ths = $(this);
  	ths.parents('.catalog-window-items-tab').find('.catalog-window-items-row').slideToggle(400);
  	ths.toggleClass('active');
  });

  $('.mob-universal-close-btn').on('click', function() {
  	$('.catalog-window').fadeOut(400);
  	$('.bg-overlay').fadeOut(400);
  	setTimeout(() => {
  		$('.open-catalog-btn').removeClass('active');
  	}, 400);
  	$('.header-mobile-universal-close').removeClass('visible');
  	bodyHasScroll();
  	$('.catalog-window-mob-subcat').removeClass('opened');
  });

  $('.only-number').on('keydown', function (e) {
  	if (e.key.length == 1 && e.key.match(/[^0-9'"]/)) {
  		return false;
  	};
  });

  $(document).on('input', '.number-input', function () {
  	var wd = $(this).val().substr(0, 1);
  	if ($(this).val().length == 0) {
  		$(this).val(0);
  	} else if (wd == '0') {
  		$(this).val($(this).val().substr(1));
  	}
  });

  $(document).on('click', '.number-minus', function () {
    var input = $(this).parent().find('.number-input');
    console.log($(this).parent().find('.number-minus'));
    if (parseInt(input.val()) > 1) {
      input.val(parseInt(input.val()) - 1);
      if ( parseInt($(this).parent().find('.number-input').val()) < 2 ) {
      	$(this).parent().find('.number-minus').prop('disabled', true);
      }
    }
    else if (parseInt(input.val()) < 3) {
    	$(this).parent().find('.number-minus').prop('disabled', true);
    }
  });

  $(document).on('click', '.number-plus', function () {
    var input = $(this).parent().find('.number-input');
    input.val(parseInt(input.val()) + 1);
    $(this).parent().find('.number-minus').prop('disabled', false);
  });

  $('.number-group').each(function() {
  	if ( $(this).find('.number-input').val() == '1' ) {
  		$(this).find('.number-minus').prop('disabled', true);
  	}
  });

  $('.acc-dropdown-add-slider').owlCarousel({
  	items: 4,
  	nav: true,
  	dots: false,
  	margin: 30
  });

  $('.account-btn').on('click', function(e) {
  	e.preventDefault();
  	let ths = $(this),
  			dd = ths.parents('.account-btns-item').find('.acc-dropdown');
  	if ( dd.is(':hidden') ) {
	  	$('.account-btn').css({
	  		'border-top-left-radius': '',
	  		'border-bottom-left-radius': ''
	  	});
  		$('.account-btns').addClass('opened');
  		$('.account-btn').addClass('mute');
  		ths.removeClass('mute').addClass('active');
  		if ( ths.index('.account-btn') == 0 ) {
  			$('.account-btn').eq(1).css('border-bottom-left-radius', '0')
  			$('.account-btn').eq(2).css('border-top-left-radius', '0')
  		}
  		else if ( ths.index('.account-btn') == 2 ) {
  			$('.account-btn').eq(0).css('border-bottom-left-radius', '0');
  			$('.account-btn').eq(1).css('border-top-left-radius', '0');
  		}
  		$('.acc-dropdown').each(function(i) {
  			if ( i != dd.index('.acc-dropdown') ) {
  				$(this).fadeOut();
  			}
  		});
  		dd.fadeIn(400);
  		$('.bg-overlay').fadeIn(400);
  	}
  });

  $('.acc-dropdown-close, .acc-dropdown-left-close').on('click', closeAccDropdown);

  function closeAccDropdown() {
  	$('.acc-dropdown').fadeOut(400);
  	$('.account-btn').css({
  		'border-top-left-radius': '',
  		'border-bottom-left-radius': ''
  	}).removeClass('mute active');
  	setTimeout(() => {
  		$('.account-btns').removeClass('opened');
  	}, 400);
  	$('.bg-overlay').fadeOut(400);
  }

  $('.slider-range-item').each(function () {
  	let ths = $(this),
		  	left = ths.find('.slider-range-left'),
		  	right = ths.find('.slider-range-right'),
		  	range = ths.find('.slider-range'),
		  	min = parseInt(left.data('min')),
		  	max = parseInt(right.data('max')),
		  	currentMin = parseInt(left.val()),
		  	currentMax = parseInt(right.val());
  	range.slider({
  		range: true,
  		min: min,
  		max: max,
  		values: [currentMin, currentMax],
  		slide: function slide(event, ui) {
  			left.val(ui.values[0]).change();
  			right.val(ui.values[1]).change();
  		}
  	});
  	left.val(range.slider('values', 0));
  	right.val(range.slider('values', 1));
  	left.on('input', function () {
  		let thsNumb = parseInt($(this).val());
  		left.val(thsNumb).change();

  		if (isNaN(thsNumb)) {
  			left.val(0).change();
  		} else if (thsNumb > max) {
  			left.val(max).change();
  		}

  		currentMin = thsNumb;
  		range.slider({
  			"values": [thsNumb, parseInt(right.val())]
  		});
  	});
  	right.on('input', function () {
  		let thsNumb = parseInt($(this).val());
  		right.val(thsNumb).change();

  		if (isNaN(thsNumb)) {
  			right.val(0).change();
  		} else if (thsNumb > max) {
  			right.val(max).change();
  		}

  		currentMax = thsNumb;
  		range.slider({
  			"values": [parseInt(left.val()), thsNumb]
  		});
  	});
  });

  $('.filter-title').on('click', function() {
  	let item = $(this).parent();
  	item.toggleClass('opened');
  	item.find('.filter-body').slideToggle(400);
  });

  let filterWrapper = $('.catalog-sidebar'),
  		helpBtn = filterWrapper.find('.filter-help-btn'),
  		checkboxes = filterWrapper.find('.checkbox-item input'),
  		rangeInputs = $('.slider-range-inp input'),
  		helpBtnVisibleTime;

  checkboxes.on('change', function() {
  	setHelpBtnPosition($(this));
  });

  rangeInputs.on('change', function() {
  	setHelpBtnPosition($(this));
  });

  $('.sale-products-slider').owlCarousel({
		items: 4,
		margin: 50,
		nav: true,
		dots: false,
		responsive: {
			0: {
				items: 2,
				margin: 20,
			},
			768: {
				items: 3,
				margin: 20,
			},
			1366: {
				items: 4,
				margin: 50,
			}
		}
	});

  function setHelpBtnPosition(item) {
  	let ths = item,
  			filterTop = filterWrapper.offset().top,
  			thsTop = ths.offset().top;
  	clearTimeout(helpBtnVisibleTime);
  	helpBtn.css('top', thsTop - filterTop - helpBtn.outerHeight() / 2 + ths.outerHeight() / 2 + 'px');
  	helpBtn.addClass('visible');
  	helpBtnVisibleTime = setTimeout(() => {
  		helpBtn.removeClass('visible');
  	}, 5000);
  }

  $('.catalog-sort-selected').on('click', function() {
  	let sort = $(this).parent();
  	$('.catalog-sort-block').each(function(i) {
  		if ( i != sort.index('.catalog-sort-block') ) {
  			$(this).removeClass('opened')
  		}
  	});
  	$(this).parent().toggleClass('opened')
  });

  $('.catalog-sort-option').on('click', function() {
  	let sort = $(this).parents('.catalog-sort-block');
  	sort.find('.catalog-sort-selected').html($(this).html());
  	sort.find('.catalog-sort-option').removeClass('selected');
  	sort.removeClass('opened');
  	$(this).addClass('selected');
  });

  let proImgSlider = $('.product-img-slider');

  proImgSlider.each(function() {
  	let drag = $(this).find('img').length > 1 ? true : false;
  	$(this).owlCarousel({
	  	items: 1,
	  	dots: true,
	  	nav: false,
	  	margin: 10,
	  	touchDrag: drag,
	  	mouseDrag: drag
	  });
  });

  $('.product-img-slider').owlCarousel({
  	items: 1,
  	dots: true,
  	nav: false,
  	margin: 10
  });

  $('.category-slider').owlCarousel({
  	items: 3,
  	nav: true,
  	dots: false,
  	margin: 30,
  	responsive: {
  		0: {
  			margin: 15,
  			autoWidth: true
  		},
  		1600: {
  			margin: 30,
  			autoWidth: false
  		}
  	}
  });

  $('.open-fiter-btn').on('click', function() {
  	$('.catalog-sidebar').toggleClass('opened');
  	bodyNoScroll();
  });

  $('.catalog-sidebar-close').on('click', function() {
  	$('.catalog-sidebar').removeClass('opened');
  	bodyHasScroll();
  });

  let prodFotorama = $('.product-page-img').fotorama(),
  		prodFotoramaAPI = prodFotorama.data('fotorama');

  function resizeProdFotorama() {
  	if ( $('.product-page-img').length > 0 ) {

	  	if ( $(window).width() < 768 ) {
	  		prodFotoramaAPI.setOptions({
	  			nav: 'dots',
	  			thumbmargin: 8
	  		})
	  	}
	  	else {
	  		prodFotoramaAPI.setOptions({
	  			nav: 'thumbs',
			  	thumbwidth: 80,
			  	thumbheight : 80,
			  	thumbmargin: 30,
			  	click: false
	  		})
	  	}

	  }
  }resizeProdFotorama();

  if ( $('.product-page-img').length > 0 ) {

	  $('.gallery-thumbs-prev-btn').on('click', function(e) {
	  	e.preventDefault();
	  	prodFotoramaAPI.show('<');
	  });
	  $('.gallery-thumbs-next-btn').on('click', function(e) {
	  	e.preventDefault();
	  	prodFotoramaAPI.show('>');
	  });

  }

  $('.icon-link').on('click', function(e) {
  	e.preventDefault();
  	$(this).toggleClass('active')
  });

  $('.open-descr-tab').on('click', function(e) {
  	e.preventDefault();
  	$('.product-page-wrapper').hide();
  	$('.product-description-page').fadeIn(400);
  	$('html, body').animate({
  		scrollTop: 0
  	}, 500)
  });

  $('.open-product-tab').on('click', function(e) {
  	e.preventDefault();
  	$('.product-description-page').hide();
  	$('.product-page-wrapper').fadeIn(400);
  	$('html, body').animate({
  		scrollTop: 0
  	}, 500)
  });

  $('.buy-product-btn, .product-list-view-add').on('click', function(e) {
  	e.preventDefault();
  	$('.basket-btn').trigger('click')
  });

  $('.open-success-popup').on('click', function(e) {
  	e.preventDefault();
  	openPopup($(this).data('success-popup'));
  });

  $('.close-popup').on('click', closePopup);

  $('.gifts-slider').owlCarousel({
  	items: 3,
  	margin: 30,
  	nav: true,
  	dots: false,
  	responsive: {
  		0: {
  			items: 1,
  			margin: 20
  		},
  		420: {
  			items: 2,
  			margin: 20
  		},
  		768: {
  			items: 3
  		}
  	}
  });

  $('.gift-item').on('click', function(e) {
  	e.preventDefault();
		$('.gift-item .gift-checkbox input[type=checkbox]').prop('checked', false);
		$('.gift-item').removeClass('checked');
		$(this).addClass('checked').find('.gift-checkbox input[type=checkbox]').prop('checked', true);
	});

	$('.gift-item-with-color').on('click', function() {
		let ths = $(this);
		$('.selected-item-img').html('').append(ths.find('.gift-img img').clone());
		$('.selected-item-name').text('').text(ths.find('.gift-title').text());
		$('.selected-item-colors').html('');
		ths.find('.gift-color-item input[type=radio]').each(function() {
			let thsInput = $(this);
			$('.selected-item-colors').append([
				`<div class="selected-item-colors-item ${ thsInput.prop('checked') ? 'selected' : '' }">`,
					`<div class="selected-item-color ${ thsInput.data('border') ? 'with-border' : '' }" style="background-color: ${ thsInput.data('color') }"></div>`,
					`<div class="selected-item-color-name">${ thsInput.data('color-name') }</div>`,
				`</div>`
			].join(''));
		});
		$('.gift-selected-color').hide();
		let activeEl = ths.find('input[type=radio]:checked');
		ths.find('.gift-selected-color').show().find('span').css('background-color', activeEl.data('color')).addClass(`${ activeEl.data('border') ? 'with-border' : ''}`);;
		openPopup('#select-color');
	});

	$('body').on('click', '.selected-item-colors-item', function() {
		let thsIndex = $(this).index('.selected-item-colors-item'),
				currEl = $('.gift-with-color-checkbox:checked').parents('.gift-item-with-color');
		currEl.find('.gift-color-item').eq(thsIndex).find('input[type=radio]').prop('checked', true);
		$('.selected-item-colors-item').removeClass('selected').eq(thsIndex).addClass('selected');
		let activeEl = currEl.find('input[type=radio]:checked');
		currEl.find('.gift-selected-color span').css('background-color', activeEl.data('color'));
		activeEl.data('border') ? currEl.find('.gift-selected-color span').addClass('with-border') : currEl.find('.gift-selected-color span').removeClass('with-border');
	});

	$('.switch-nav-link').on('click', function(e) {
		e.preventDefault();
		let thsTab = $(this).data('tab'),
				currTab = $(`.tabs-block[data-tab=${thsTab}]`);
		if ( currTab.is(':hidden') ) {
			$('.switch-nav-link').removeClass('active');
			$(this).addClass('active');
			$('.tabs-block').hide();
			currTab.fadeIn(400);
		}
	});

	$('.also-buy-slider').owlCarousel({
		items: 6,
		margin: 50,
		nav: true,
		dots: false,
		responsive: {
			0: {
				items: 2,
				margin: 20
			},
			576: {
				items: 3,
				margin: 20
			},
			768: {
				items: 4,
				margin: 20
			},
			992: {
				items: 5,
				margin: 20
			},
			1200: {
				margin: 20
			},
			1366: {
				items: 6,
				margin: 50
			}
		}
	});

	function openCitySearch() {
		let searchDrop = $('.checkout-city-dropdown');
		searchDrop.show();
		setTimeout(() => {
			searchDrop.addClass('opened')
		}, 50);
	}

	function closeCitySearch() {
		let searchDrop = $('.checkout-city-dropdown');
		searchDrop.removeClass('opened');
		setTimeout(() => {
			searchDrop.hide()
		}, 400);
	}

	$('.checkout-city-input').on('input', function() {
		if ( $(this).val().trim().length !== 0 ) {
			openCitySearch();
		}
		else {
			closeCitySearch()
		}
	});

	$('.checkout-city-dropdown .search-results a').on('click', function(e) {
		e.preventDefault();
		let ths = $(this);
		$('.checkout-city-input').val(ths.data('value'));
		closeCitySearch();
	});

	$('.del-radion-open-tab').on('change', function() {
		let currTab = $('.del-radion-open-tab:checked').data('tab');
		$('.checkout-delivery-tab').hide();
		$(`.checkout-delivery-tab[data-tab=${currTab}]`).fadeIn(400);
	});

	$('.select-style').select2({
		minimumResultsForSearch: -1,
		width: '100%'
	});

	autosize($('textarea.form-control'));

	$('.header-user').on('click', function() {
		$('.header-acc').toggleClass('opened')
	});

	$('.order-main').on('click', function() {
		let parent = $(this).parent();
		parent.toggleClass('opened');
		parent.find('.order-composition').slideToggle(400)
	});

	$('.promocode-input').on('input', function() {
		let ths = $(this);
		if ( ths.val().length > 0 ) {
			ths.addClass('active');
			$('.promocode-apply').addClass('visible');
		}
		else {
			ths.removeClass('active');
			$('.promocode-apply').removeClass('visible');
		}
	});

	$('.promocode-apply').on('click', function(e) {
		e.preventDefault();
		if ( !$('.basket-promo').hasClass('success') && !$('.basket-promo').hasClass('danger') ) {
			$('.basket-promo').addClass('success');
			$('.promocode-input').prop('disabled', true);
		}
		else if ( $('.basket-promo').hasClass('danger') ) {
			$('.basket-promo').removeClass('success danger');
			$('.promocode-input').prop('disabled', false).removeClass('active').val('');
			$(this).removeClass('visible');
			$('.basket-promo .text-danger').hide();
		}
		else {
			$('.basket-promo').removeClass('success danger');
			$('.promocode-input').prop('disabled', false).removeClass('active').val('');
			$(this).removeClass('visible');
		}
	});

	let galleryFotorama = $('.images-gallery').fotorama(),
  		galleryFotoramaAPI = galleryFotorama.data('fotorama');

  function initGallery() {
  	if ( $('.images-gallery').length > 0 ) {
  		if ( $(window).width() > 576 ) {
	  		galleryFotoramaAPI.setOptions({
					nav: 'thumbs',
					thumbwidth: 55,
					thumbheight : 55,
					thumbmargin: 20,
					width: '100%'
				});
	  	}
	  	else {
	  		galleryFotoramaAPI.setOptions({
					nav: 'dots',
					width: '100%'
				});
	  	}
  	}
  }initGallery();
	

	$('.share-link').on('click', function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('opened');
	});

	$('.news-slider').owlCarousel({
		items: 3,
		margin: 30,
		nav: true,
		dots: false,
		responsive: {
			0: {
				items: 1,
				margin: 20
			},
			576: {
				items: 2,
				margin: 20
			},
			992: {
				items: 3
			}
		}
	});

	let aboutSliderInterval,
			aboutSliderTimeout = 4000,
			aboutSlider = $('.about-slider');

	function initAboutSlider() {
		if ( $(window).width() < 576 ) {
			aboutSlider.addClass('owl-carousel').owlCarousel({
				items: 1,
				nav: false,
				dots: true,
				loop: true
			})
		}
		else {
			aboutSlider.trigger('destroy.owl.carousel').removeClass('owl-carousel');
		}
	}initAboutSlider();

	$('.about-slider-nav-link-progress span').css({
		'-webkit-animation-duration': `${aboutSliderTimeout / 1000}s`,
    'animation-duration': `${aboutSliderTimeout / 1000}s`
	});

	function aboutNextSlide() {
		let curr = $('.about-slider-item.active'),
				ind = curr.index('.about-slider-item');
		curr.removeClass('active');
		if ( ind == $('.about-slider-item').length - 1 ) {
			$('.about-slider-item').eq(0).addClass('active');
		}
		else {
			$('.about-slider-item').eq(ind + 1).addClass('active');
		}
	}

	function aboutNextSlide() {
		let curr = $('.about-slider-item.active'),
				ind = curr.index('.about-slider-item');
		curr.removeClass('active');
		if ( ind == $('.about-slider-item').length - 1 ) {
			$('.about-slider-item').eq(0).addClass('active');
		}
		else {
			$('.about-slider-item').eq(ind + 1).addClass('active');
		}
		addSliderThumb();
	}

	function aboutPrevSlide() {
		let curr = $('.about-slider-item.active'),
				ind = curr.index('.about-slider-item');
		curr.removeClass('active');
		if ( ind == 0 ) {
			$('.about-slider-item').eq( $('.about-slider-item').length - 1 ).addClass('active');
		}
		else {
			$('.about-slider-item').eq(ind - 1).addClass('active');
		}
		addSliderThumb();
	}

	function addSliderThumb() {
		$('.about-slider-nav-link').removeClass('active').eq( $('.about-slider-item.active').index('.about-slider-item') ).addClass('active');
		$('.about-slider-item')
	}

	aboutSliderInterval = setInterval(() => {
		aboutNextSlide()
	}, aboutSliderTimeout);

	$('.about-slider-nav-btn.next').on('click', function() {
		clearInterval(aboutSliderInterval);
		aboutNextSlide();
		aboutSliderInterval = setInterval(() => {
			aboutNextSlide()
		}, aboutSliderTimeout);
	});

	$('.about-slider-nav-btn.prev').on('click', function() {
		clearInterval(aboutSliderInterval);
		aboutPrevSlide();
		aboutSliderInterval = setInterval(() => {
			aboutNextSlide()
		}, aboutSliderTimeout);
	});

	$('.about-slider-nav-link').on('click', function() {
		let i = $(this).index('.about-slider-nav-link');
		clearInterval(aboutSliderInterval);
		$('.about-slider-item.active').removeClass('active');
		$('.about-slider-item').eq(i).addClass('active');
		$('.about-slider-nav-link').removeClass('active');
		$(this).addClass('active');
		aboutSliderInterval = setInterval(() => {
			aboutNextSlide()
		}, aboutSliderTimeout);
	});

	function scrollSidebar() {
		if ( $('.about-company-sidebar').length > 0 ) {
			$('.about-company-sidebar-link').each(function() {
				let ths = $(this);
				if (  $(ths.attr('href')).length > 0 ) {
					if ( $(window).scrollTop() >= $(ths.attr('href')).offset().top - 20 ) {
						$('.about-company-sidebar-link').removeClass('active');
						ths.addClass('active')
					}
					else {
						ths.removeClass('active')
					}
				}
			});
		}
	}scrollSidebar();

	$('.about-company-sidebar-link').on('click', function(e) {
		e.preventDefault();
		let id = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 20
		}, 1000)
	});

	$('.open-shop-results').on('click', function(e) {
		e.preventDefault();
		let thsText = $(this).text();
		$('.select-city-tab').hide();
		$('.select-shop-tab').fadeIn(400);
		$('.current-city-link').text(thsText)
	});

	$('.current-city-link').on('click', function(e) {
		e.preventDefault();
		$('.select-shop-tab').hide();
		$('.select-city-tab').fadeIn(400);
	});

	$(window).on('scroll', function() {
		scrollSidebar();
	});

	$(window).on('resize', function() {
		checkNavSwitchPos();
		checkAccordionSwitchPos();
		adaptiveHeader();
		activateAccordionMobSlider();
		initBannerSlider();
		initAdvSlider();
		helpBtn.removeClass('visible');
		resizeProdFotorama();
		initGallery();
		initAboutSlider();
	});

	$(document).on('click', function(e) {
		if ( !$(e.target).closest('.has-submenu').length ) {
			$('.has-submenu').removeClass('opened')	
		}
		if ( !$(e.target).closest('.header-search').length ) {
			closeSearch()
		}
		if ( !$(e.target).closest('.open-mob-menu').length && !$(e.target).closest('.header-top').length ) {
			$('.header-top').removeClass('opened');
		}
		if ( !$(e.target).closest('.catalog-sort-block.opened').length ) {
			$('.catalog-sort-block.opened').removeClass('opened')
		}
		if ( !$(e.target).closest('.catalog-sidebar').length && !$(e.target).closest('.open-fiter-btn').length && $('.catalog-sidebar.opened').length != 0 ) {
			$('.catalog-sidebar').removeClass('opened');
			bodyHasScroll();
		}
		if ( !$(e.target).closest('.header-acc').length && !$(e.target).closest('.profile-link').length ) {
			$('.header-acc').removeClass('opened visible')
		}
		if ( !$(e.target).closest('.share-block').length ) {
			$('.share-block').removeClass('opened')
		}
	});

	$(window).on('load', function() {
		openPopup('#is-your-city');
		adaptiveHeader();
	});

});
