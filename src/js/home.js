$(function() {
  map.init();
  $(".js-tab-content").hide();
  $(".js-tab-content:first").show();
  if($( window ).width() < 992) {
  $('.nav').hide()
}


  /*hamburger-manu*/
  $(".js-icon").click(function(event) {
    $(this).toggleClass('is-active')
    $('.nav').slideToggle('fast')
  });

  /*hamburger-manu(on-resize)*/
  $(window).resize(function() {
    var sWidth = $( window ).width();
    if(sWidth > 992) {
      $('.js-icon').removeClass('is-active');
      $('.nav').slideDown()
    } else if(sWidth < 992 && sWidth > 900) {
      $('.js-icon').removeClass('is-active');
      $('.nav').hide()
    }
  });

  /*tabs(if in tab mode)*/
  $(".js-tab").click(function(event) {
    event.preventDefault();

    $(".js-tab-content").slideUp();
    var activeTab = $(this).attr("rel");
    $("#"+activeTab).slideDown();

    $(".js-tab").removeClass("is-active");
    $(this).addClass("is-active");

    $(".js-tab-accordion").removeClass("is-active");
    $(".js-tab-accordion[rel^='"+activeTab+"']").addClass("is-active");
  });

  /* tabs(if in accordion mode)*/

  $(".js-tab-accordion").click(function(event) {
    event.preventDefault();

    $(".js-tab-content").slideUp();
    var accordion_activeTab = $(this).attr("rel");
    $("#"+accordion_activeTab).slideDown();

    $(".js-tab-accordion").removeClass("is-active");
    $(this).addClass("is-active");

    $(".js-tab").removeClass("is-active");
    $(".js-tab[rel^='"+accordion_activeTab+"']").addClass("is-active");
  });

  /* button shadow effect in input submit, because can't have pseudo-elements*/

  $( ".input__submit").mousedown(function(e) {
    $( ".input__submit-shadow").addClass('is-active');
  });

  $( ".input__submit").mouseup(function(e) {
    $( ".input__submit-shadow").removeClass('is-active');
  });

  /*avoid to submit the form*/

  $( ".input__submit").click(function(e) {
    return false;
  });

  //Scroll to section
  $("nav").find("a").click(function(e) {
    e.preventDefault();
    var section = $(this).attr("href");
    $("html, body").animate({
        scrollTop: $(section).offset().top
    });
  });

  /*testimonials section interaction*/

  $('.js-thumbnail').click(function() {
    var nameImg = $(this).attr("data-src");
    var quoteText = $(this).attr("data-quote");
    var quoteName = $(this).attr("data-name");
    var quotePosition = $(this).attr("data-position");

    $('.testimonials__img').css('background-image', 'url(../img/' + nameImg + '.png)');

    $('.testimonials__quote').fadeOut(160, function() {
      $(this).text(quoteText).fadeIn(160);
    })

    $('.testimonials__name').fadeOut(160, function() {
      $(this).text(quoteName).fadeIn(160);
    })

    $('.testimonials__position').fadeOut(160, function() {
      $(this).text(quotePosition).fadeIn(160);
    })

    $(".js-thumbnail").removeClass("is-active");
    $(this).addClass("is-active");
  });

  jQuery.mark = {
    jump: function (options) {
      var defaults = {
        selector: 'a.scroll-on-page-link'
      };
      if (typeof options == 'string') {
        defaults.selector = options;
      }

      options = jQuery.extend(defaults, options);
      return jQuery(options.selector).click(function (e) {
        var jumpobj = jQuery(this);
        var target = jumpobj.attr('href');
        var thespeed = 1000;
        var offset = jQuery(target).offset().top;
        jQuery('html,body').animate({
          scrollTop: offset
        }, thespeed, 'swing');
        e.preventDefault();
      });
    }
  };
});

/*google maps*/

var map = (function () {
  var myLatlng = new google.maps.LatLng(37.780171, -122.417563),
      mapCenter = new google.maps.LatLng(37.780171, -122.417563),
      mapCanvas = document.getElementById('map'),
      mapOptions = {
        center: mapCenter,
        zoom: 12,
        scrollwheel: false,
        draggable: true,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      map = new google.maps.Map(mapCanvas, mapOptions),
      contentString =
        '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<div id="bodyContent"'+
        '<p class="map-text">PO Box 7775</p>'+
        '<p class="map-text">San francisco, CA</p>'+
        '<p class="map-text">94120-7775, US</p>'+
        '<p class="map-text">Tel. +1 951-693-1880</p>'+
        '</div>'+
        '</div>',
      infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 300
      }),
      marker = new google.maps.Marker({
        icon: '../img/dot-map.png',
        position: myLatlng,
        map: map,
        title: ''
      });

  return {
    init: function () {
      map.set('styles', [{
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
          { hue: '#ffff00' },
          { saturation: 30 },
          { lightness: 10}
        ]}
      ]);

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map,marker);
      });

      google.maps.event.addListener(map, 'idle', function(){
        jQuery('.gm-style-iw').prev('div').remove();
      });
    }
  };
}());
