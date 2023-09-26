function openFilterAdvancePopup() {
    var advanceSearchBtn = document.getElementById('advanceSearchBtn');
    var advanceFilterPopUp = document.getElementById('advanceFilterPopUp');
    var advanceFilterPopUpContent = document.getElementById('advanceFilterPopUpContent');
    var advanceFilterPopUpSearchBtn = document.getElementById('advanceFilterPopUpSearchBtn');

    advanceSearchBtn.style.display = 'none';
    advanceFilterPopUp.classList.add('open');
    advanceFilterPopUpContent.style.opacity = '1';
    advanceFilterPopUpSearchBtn.style.opacity = '1';
}

function closeFilterAdvancePopup() {
    var advanceSearchBtn = document.getElementById('advanceSearchBtn');
    var advanceFilterPopUp = document.getElementById('advanceFilterPopUp');
    var advanceFilterPopUpContent = document.getElementById('advanceFilterPopUpContent');
    var advanceFilterPopUpSearchBtn = document.getElementById('advanceFilterPopUpSearchBtn');

    advanceSearchBtn.style.display = 'block';
    advanceFilterPopUp.classList.remove('open');
    advanceFilterPopUpContent.style.opacity = '0';
    advanceFilterPopUpSearchBtn.style.opacity = '0';
}