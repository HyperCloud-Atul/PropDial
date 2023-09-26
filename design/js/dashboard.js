$(document).ready(function () {
        if($(window).width() > 850) {
           // $("#collapsibleNavbar1").removeClass("collapse");
           $("#arrowOrg").addClass("active");
           // $("#eventArrow").addClass("active");
           $("#EventRevenue").addClass("active");
           $("#openEvents").addClass("active");
           $("#CardTransaction").addClass("active");
           $("#CardNotification").addClass("active");
           // $("#CardAnalytics").addClass("active");
        }
    });

function fullcard(arrowVar)
{
  // console.log(arrowVar).;
  arrowVar.classList.toggle('active');

}


$(document).ready(function() {
  var owl = $('#property-list-detail');
  owl.owlCarousel({
    margin: 20,
    loop: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    nav:false,
    dots:false,
    stagePadding: 30,
    rewind: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    }
  });
});


$(document).ready(function() {
  var owl = $('#extra-list-detail');
  owl.owlCarousel({
    margin: 30,
    // marginBottom:30,
    loop: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    nav:false,
    dots:false,
    stagePadding: 20,
    rewind: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    }
  });
});

$(document).ready(function() {
  var owl = $('#vehicle-list');
  owl.owlCarousel({
    margin: 20,
    loop: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    nav:false,
    dots:false,
    stagePadding: 30,
    rewind: true,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  });
});
