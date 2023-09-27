
// Menu's nav-link highlighted those are active - start
$(".nav .nav-link").on("click", function () {
  $(".nav").find(".active").removeClass("active");
  $(this).addClass("active");
});
// Menu's nav-link highlighted those are active - end

// fixed-top or sticky-top navbar background change on windows scrolling - start
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if (scroll < 70) {
    $('.sticky-top').removeClass("sticky");
  } else {
    $('.sticky-top').addClass("sticky");
  }
});
// fixed-top or sticky-top navbar background change on windows scrolling - end

// sideNavbar - start

var hamberIcon = document.getElementById('hamberIcon');
var fullContent = document.getElementById('fullContent');
var sideNavbar = document.getElementById('sideNavbar');

hamberIcon.addEventListener('click', sideNavbarOpen, false);

function sideNavbarOpen() {
  sideNavbar.classList.add('open');
}

fullContent.addEventListener('click', sideNavbarClose, false);

function sideNavbarClose() {
  sideNavbar.classList.remove('open');
}


// sideNavbar - end


//  more add options - start

function openMoreAddOptions() {
  document.getElementById('moreAddOptions').classList.add('open');
}

function closeMoreAddOptions() {
  document.getElementById('moreAddOptions').classList.remove('open');
}

//  more add options - end


// sticky top property details - start

function openPropertyDetails(propertyDetails) {
  propertyDetails.classList.toggle('open');
}

// sticky top property details - end


$(document).ready(function () {
  var owl = $('#clients-list');
  owl.owlCarousel({
    margin: 80,
    nav: true,
    loop: true,
    autoplay: true,
    smartSpeed: 3000,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    nav: false,
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
