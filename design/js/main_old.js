// Ristrict mouse right click - start
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

// With jQuery
$(document).on({
    "contextmenu": function(e) {
        console.log("ctx menu button:", e.which);

        // Stop the context menu
        e.preventDefault();
    },
    "mousedown": function(e) {
        console.log("normal mouse down:", e.which);
    },
    "mouseup": function(e) {
        console.log("normal mouse up:", e.which);
    }
});

// Ristrict mouse right click - end

// Collapse Navbar toggle menu after clicking on menu items - Start
$(document).on('click', function() {
  $('.collapse').collapse('hide');
});
// Collapse Navbar toggle menu after clicking on menu items - End


// Menu's nav-link highlighted those are active - start
  $(".nav .nav-link").on("click", function() {
    $(".nav").find(".active").removeClass("active");
    $(this).addClass("active");
  });
  // Menu's nav-link highlighted those are active - end

  // fixed-top or sticky-top navbar background change on windows scrolling - start
    $(window).scroll(function(){
        var scroll = $(window).scrollTop();
        if(scroll < 70){
            $('.sticky-top').removeClass("sticky");
        } else{
            $('.sticky-top').addClass("sticky");
        }
    });
   // fixed-top or sticky-top navbar background change on windows scrolling - end



// jQuery(document).ready(function(){
//
//     $('#videolink').magnificPopup({
//         type:'inline',
//         midClick:true
//
//     });
// });

// $(function () {
//     $("#team-members").owlCarousel({
//         items: 2,
//         autoplay: true,
//         smartSpeed: 700,
//         loop: true,
//         autoplayHoverPause: true,
//         nav: true,
//         dots: false,
//         responsive: {
//             0: {
//                 items: 1
//             },
//             480: {
//                 items: 2
//             }
//         }
//     });
// });

$(function () {

    $("#progress-elements").waypoint(function () {

        $(".progress-bar").each(function () {

            $(this).animate({
                width: $(this).attr("aria-valuenow") + "%"
            }, 2000);

        });

        this.destroy();
    }, {
        offset: 'bottom-in-view'
    });


});


   $(function () {

    $("#services-tabs").responsiveTabs({
        animation: 'slide'
    });



    //  $('.gallery').magnificPopup({
    //     delegate: '.popimg',
    //     type: 'image',
    //     gallery: {
    //         enabled: true
    //     }
    // });
    //   $('.gallery').isotope({
    //   // options
    //   itemSelector: '.items'
    // });
    //
    // var $gallery = $('.gallery').isotope({
    //   // options
    // });

    // filter items on button click
    $('.filtering').on( 'click', 'span', function() {

        var filterValue = $(this).attr('data-filter');

        $gallery.isotope({ filter: filterValue });

    });

    $('.filtering').on( 'click', 'span', function() {

        $(this).addClass('active').siblings().removeClass('active');

    });

});

  // $(document).ready(function(){
  //     $("#testimonial-slider").owlCarousel({
  //        items:1,
  //         itemsDesktop:[1000,1],
  //         itemsDesktopSmall:[979,1],
  //         itemsTablet:[768,1],
  //         pagination:true,
  //         autoPlay:false
  //
  //     });
  //    $('.count').counterUp({
  //               delay: 10,
  //               time: 4000
  //           });
  // });

  $(document).ready(function() {
    var owl = $('#designs-list');
    owl.owlCarousel({
      margin: 20,
      loop: true,
      autoplay: true,
      smartSpeed:3000,
      autoplayTimeout: 8500,
      autoplayHoverPause: true,
      nav:false,
      // dots:true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 4
        }
      }
    });
  });


    $(document).ready(function() {
      var owl = $('#clients-list');
      owl.owlCarousel({
        margin: 80,
        nav: true,
        loop: true,
        autoplay: true,
        smartSpeed:3000,
        autoplayTimeout: 4000,
        autoplayHoverPause: false,
        nav:false,
        // dots:true,
        responsive: {
          0: {
            items: 2
          },
          600: {
            items: 3
          },
          1024: {
            items: 4
          }
        }
      });
    });

// $(function(){
//     $("#clients-list").owlCarousel({
//        items:6,
//         autoPlay:false,
//         smartSpeed:700,
//         loop:true,
//         autoplayHoverPause:true,
//         nav:false,
//         dots:false,
//
//         responsive:{
//             0:{
//                 items:3
//             },
//
//              480:{
//                 items:3
//             },
//
//              768:{
//                 items:6
//             }
//         }
//     });

    // $("#news-slider").owlCarousel({
    //     items:3,
    //     itemsDesktop:[1199,3],
    //     itemsDesktopSmall:[1000,2],
    //     itemsMobile:[600,1],
    //     pagination:false,
    //     navigationText:false,
    //     autoPlay:true
    //
    //
    // });

    // $("#banner-slider").owlCarousel({
    //     items: 1,
    //     itemsDesktop: [1199, 1],
    //     itemsDesktopSmall: [1000, 1],
    //     itemsMobile: [600, 1],
    //     pagination: false,
    //     navigationText: false,
    //     autoPlay: true
    //
    //
    // });


// });

jQuery(document).ready(function(){
   $(window).scroll(function() {
       if ($(window).scrollTop() > 80) {
        $('.main_header').addClass('sticky');
    } else {
        $('.main_header').removeClass('sticky');
    }
});


$('.mobile-toggle').click(function() {
    if ($('.main_header').hasClass('open-nav')) {
        $('.main_header').removeClass('open-nav');
    } else {
        $('.main_header').addClass('open-nav');
    }
});





$('.main_header li a').click(function() {
    if ($('.main_header').hasClass('open-nav')) {
        $('.navigation').removeClass('open-nav');
        $('.main_header').removeClass('open-nav');
    }
});


$('nav a').click(function(event) {
    var id = $(this).attr("href");
    var offset = 0;
    var target = $(id).offset().top - offset;
    $('html, body').animate({
        scrollTop: target
    }, 600);
    event.preventDefault();
});

new WOW().init();
});


  // map - start

  // When the window has finished loading create our google map below
  google.maps.event.addDomListener(window, 'load', init);

  function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: 11,

      // The latitude and longitude to center the map (always required)
      center: new google.maps.LatLng(18.5967323, 73.7011654), // New York

      // How you would like to style the map.
      // This is where you would paste any style found on Snazzy Maps.
      styles: [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
          "saturation": 36
        }, {
          "color": "#000000"
        }, {
          "lightness": 40
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#000000"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 17
        }, {
          "weight": 1.2
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 21
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 29
        }, {
          "weight": 0.2
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 18
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 19
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 17
        }]
      }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(18.5967323, 73.7011654),
      map: map,
      title: 'WebPicker'
    });
  }
// map - end
