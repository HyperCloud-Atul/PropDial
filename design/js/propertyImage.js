// more options for more button in card - start

function moreClickOpen(moreBtnDetails) {
    moreBtnDetails.classList.toggle('open');
}

// more options for more button in card - end

function openPropertyDetails(propertyDetails){
    propertyDetails.classList.toggle('open');
  }

// trash card div open/close - start

function trashCardsOpen(trashDiv, arrow) {
    trashDiv.classList.toggle('open');
    arrow.classList.toggle('open');
}

// trash card div open/close - end

// trash pop up - start

function openDeletePopUp(situation) {

    var allCapital = situation.toUpperCase();
    var allNonCapital = situation.toLowerCase();

    var trashPopUpDiv = document.getElementById('trashPopUpDiv');
    trashPopUpDiv.classList.add('show');

    var trashPopUpParaText = document.getElementById('trashPopUpParaText');
    trashPopUpParaText.innerHTML = situation;

    var trashPopUpSituationBtn = document.getElementById('trashPopUpSituationBtn');
    trashPopUpSituationBtn.children[0].innerHTML = allCapital;

    if (situation === 'Delete') {
        trashPopUpSituationBtn.classList.remove('recover');
        trashPopUpSituationBtn.classList.add('delete');
    } else {
        trashPopUpSituationBtn.classList.add('recover');
        trashPopUpSituationBtn.classList.remove('delete');
    }

}

function closeDeletePopUp() {
    var trashPopUpDiv = document.getElementById('trashPopUpDiv');
    trashPopUpDiv.classList.remove('show');
}

// trash pop up - end