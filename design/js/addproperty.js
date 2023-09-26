


function addPropertyMenu(menuList) {

  var menuIndicator = document.getElementById('menuIndicator');
  var Basic = document.getElementById('Basic');
  var Details = document.getElementById('Details');
  var More = document.getElementById('More');

  var section1 = document.getElementById("section1");
  var section2 = document.getElementById("section2");
  var section3 = document.getElementById("section3");

  Basic.classList.remove('active');
  Details.classList.remove('active');
  More.classList.remove('active');

  if (menuList === 'Basic') {
    menuIndicator.style.transform = 'translateX(0%)';
    Basic.classList.add('active');
    section1.style.transform = 'translateX(0%)';
    section2.style.transform = 'translateX(0%)';
    section3.style.transform = 'translateX(0%)';
  }
  else if (menuList === 'Details') {
    menuIndicator.style.transform = 'translateX(100%)';
    Details.classList.add('active');
    section1.style.transform = 'translateX(-100%)';
    section2.style.transform = 'translateX(-100%)';
    section3.style.transform = 'translateX(-100%)';
  }
  else if (menuList === 'More') {
    menuIndicator.style.transform = 'translateX(200%)';
    More.classList.add('active');
    section1.style.transform = 'translateX(-200%)';
    section2.style.transform = 'translateX(-200%)';
    section3.style.transform = 'translateX(-200%)';
  }

}


function propertyToggleClick(propertyType) {

  var ResidentialText = document.getElementById('ResidentialText');
  var CommercialText = document.getElementById('CommercialText');
  var section2ResidentialSection = document.getElementById('section2ResidentialSection');
  var section2CommercialSection = document.getElementById('section2CommercialSection');

  ResidentialText.classList.remove('active');
  CommercialText.classList.remove('active');

  if (propertyType.classList.contains('Residential')) {
    propertyType.classList.remove('Residential');
    propertyType.classList.add('Commercial');
    CommercialText.classList.add('active');
    section2ResidentialSection.style.display = 'none';
    section2CommercialSection.style.display = 'block';
  } else if (propertyType.classList.contains('Commercial')) {
    propertyType.classList.remove('Commercial');
    propertyType.classList.add('Residential');
    ResidentialText.classList.add('active');
    section2ResidentialSection.style.display = 'block';
    section2CommercialSection.style.display = 'none';
  }

}

function openRentSection(cb1, cb2, objType) {
  var rentSection = document.getElementById('rentSection');
  var saleSection = document.getElementById('saleSection');
  var cb1Cnt = document.getElementById(cb1);
  var cb2Cnt = document.getElementById(cb2);


  if (cb1Cnt.checked && !cb2Cnt.checked) {
    console.log(cb1Cnt.checked);
    console.log(cb2Cnt.checked);
    cb1Cnt.checked = false;
    cb1Cnt.setAttribute('checked', true);
  }
  //  console.log("cb1.checked", cb1.checked)
  if (objType === 'Rent' && !cb1Cnt.checked) {
    rentSection.style.display = 'none';
    //console.log('openRentSection');

  } else {
    rentSection.style.display = 'block';
  }


  if (objType === 'Sale' && !cb1Cnt.checked) {
    saleSection.style.display = 'none';
    //console.log('openRentSection');

  } else {
    saleSection.style.display = 'block';
  }


}

function openSaleSection() {
  var saleSection = document.getElementById('saleSection');
  var businessTypeRent = document.getElementById('businessTypeRent');
  var businessTypeSale = document.getElementById('businessTypeSale');

  if (businessTypeSale.checked) {
    saleSection.style.display = 'none';
  } else {
    saleSection.style.display = 'block';
  }
}

function ageOfPropertyCalc() {
  var yearOfConstructionSelect = document.getElementById('yearOfConstructionSelect');
  var ageOfPropertyCount = document.getElementById('ageOfPropertyCount');

  var yearValue = yearOfConstructionSelect.options[yearOfConstructionSelect.selectedIndex].text;
  var dt = new Date();

  ageOfPropertyCount.innerHTML = dt.getFullYear() - Number(yearValue);

}

function openCarParkingClosedDiv() {
  var extraCarParkingClosed = document.getElementById('extraCarParkingClosed');

  extraCarParkingClosed.classList.toggle('open');

  var Basment1 = document.getElementById('Basment1');
  var Basment2 = document.getElementById('Basment2');
  var Basment3 = document.getElementById('Basment3');
  var Stilt = document.getElementById('Stilt');
  var Shade = document.getElementById('Shade');
  var Basment1Number = document.getElementById('Basment1Number');
  var Basment2Number = document.getElementById('Basment2Number');
  var Basment3Number = document.getElementById('Basment3Number');
  var StiltNumber = document.getElementById('StiltNumber');
  var ShadeNumber = document.getElementById('ShadeNumber');

  Basment1.checked = false;
  Basment2.checked = false;
  Basment3.checked = false;
  Stilt.checked = false;
  Shade.checked = false;

  Basment1Number.innerHTML = '0';
  Basment2Number.innerHTML = '0';
  Basment3Number.innerHTML = '0';
  StiltNumber.innerHTML = '0';
  ShadeNumber.innerHTML = '0';

  closeCarParkingNumberChange();
}

function changeNumberAccordingInput(checkbox, number) {
  if (checkbox.checked === true) {
    number.innerHTML = '1';
  } else {
    number.innerHTML = '0';
  }
}

function parkingNumberChange(checkbox, number) {

  if (number.innerHTML === '0') {
    checkbox.checked = true;
    number.innerHTML = '1';
  } else if (number.innerHTML === '1') {
    number.innerHTML = '2';
    checkbox.checked = true;
  } else if (number.innerHTML === '2') {
    number.innerHTML = '3';
    checkbox.checked = true;
  } else if (number.innerHTML === '3') {
    checkbox.checked = false;
    number.innerHTML = '0';
  }

}

function closeCarParkingNumberChange() {
  var carParkingCloseNumber = document.getElementById('carParkingCloseNumber');
  var carParkingTotal = document.getElementById('carParkingTotal');
  var carParkingOpenNumber = document.getElementById('carParkingOpenNumber').innerHTML;
  var Basment1NumberString = document.getElementById('Basment1Number').innerHTML;
  var Basment2NumberString = document.getElementById('Basment2Number').innerHTML;
  var Basment3NumberString = document.getElementById('Basment3Number').innerHTML;
  var StiltNumberString = document.getElementById('StiltNumber').innerHTML;
  var ShadeNumberString = document.getElementById('ShadeNumber').innerHTML;

  var totalclosedParkingNumber =
    Number(Basment1NumberString) +
    Number(Basment2NumberString) +
    Number(Basment3NumberString) +
    Number(StiltNumberString) +
    Number(ShadeNumberString);

  console.log(totalclosedParkingNumber);

  carParkingCloseNumber.innerHTML = totalclosedParkingNumber;


  carParkingTotal.innerHTML =
    totalclosedParkingNumber +
    Number(carParkingOpenNumber);

}

function additinalRoomsTotal() {
  var additionalRoomsTotal = document.getElementById('additionalRoomsTotal');
  var ServentRoomNumber = document.getElementById('ServentRoomNumber').innerHTML;
  var ServentRoom2Number = document.getElementById('ServentRoom2Number').innerHTML;
  var StoreRoomNumber = document.getElementById('StoreRoomNumber').innerHTML;
  var PoojaRoomNumber = document.getElementById('PoojaRoomNumber').innerHTML;
  var StudyRoomNumber = document.getElementById('StudyRoomNumber').innerHTML;
  var PowderRoomNumber = document.getElementById('PowderRoomNumber').innerHTML;

  additionalRoomsTotal.innerHTML =
    Number(ServentRoomNumber) +
    Number(ServentRoom2Number) +
    Number(StoreRoomNumber) +
    Number(PoojaRoomNumber) +
    Number(StudyRoomNumber) +
    Number(PowderRoomNumber);
}

function additinalAreaTotal() {
  var additinalAreaTotal = document.getElementById('additinalAreaTotal');
  var FrontYardNumber = document.getElementById('FrontYardNumber').innerHTML;
  var BackYardNumber = document.getElementById('BackYardNumber').innerHTML;
  var TerraceNumber = document.getElementById('TerraceNumber').innerHTML;

  additinalAreaTotal.innerHTML =
    Number(FrontYardNumber) +
    Number(BackYardNumber) +
    Number(TerraceNumber);
}

function proprtyDetailCard(card) {
  card.classList.toggle('open');
}

function openBathroomNumberChoose(select) {
  select.classList.add('open');
}
function closeBathroomNumberChoose(select) {
  select.classList.remove('open');
}