$(document).ready(function () {
        if($(window).width() > 850) {
           // $("#collapsibleNavbar1").removeClass("collapse");
           $("#order1").addClass("active");
           $("#order2").addClass("active");
           $("#order3").addClass("active");
           $("#order4").addClass("active");
           $("#order5").addClass("active");
           $("#order6").addClass("active");

        }
    });

function fullcard(arrowVar)
{
  // console.log(arrowVar).;
  arrowVar.classList.toggle('active');

}

function lineshow(showVar){
  console.log(showVar);
  if(showVar==='incomplete'){
    document.getElementById('hrLine').style.transform = 'translateX(0%)';
    document.getElementById('hrLine').style.borderColor = 'orange';
    document.getElementById('incompleteOrders').style.transform = 'translateX(0%)';
    document.getElementById('completeOrders').style.transform = 'translateX(-200%)';
    document.getElementById('declinedOrders').style.transform = 'translateX(-400%)';

  }
  else if (showVar==='complete') {
    document.getElementById('hrLine').style.transform = 'translateX(100%)';
    document.getElementById('hrLine').style.borderColor = '#65c032';
    document.getElementById('incompleteOrders').style.transform = 'translateX(100%)';
    document.getElementById('completeOrders').style.transform = 'translateX(-100%)';
    document.getElementById('declinedOrders').style.transform = 'translateX(-300%)';

  }
  else if (showVar==='declined') {
    document.getElementById('hrLine').style.transform = 'translateX(200%)';
    document.getElementById('hrLine').style.borderColor = '#ff5757';
    document.getElementById('incompleteOrders').style.transform = 'translateX(200%)';
    document.getElementById('completeOrders').style.transform = 'translateX(0%)';
    document.getElementById('declinedOrders').style.transform = 'translateX(-200%)';
  }

}
