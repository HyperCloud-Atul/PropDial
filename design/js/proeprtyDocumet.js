function addPropertyMenu(menuList) {

    var menuIndicator = document.getElementById('menuIndicator');
    var PropertyDocs = document.getElementById('PropertyDocs');
    var PropDailDocs = document.getElementById('PropDailDocs');
    var UtilityBills = document.getElementById('UtilityBills');
    var MaintenanceBills = document.getElementById('MaintenanceBills');

    var section1 = document.getElementById("sectionPropertyDocs");
    var section2 = document.getElementById("sectionPropDailDocs");
    var section3 = document.getElementById("sectionUtilityBills");
    var section4 = document.getElementById("sectionMaintenanceBills");

    PropertyDocs.classList.remove('active');
    PropDailDocs.classList.remove('active');
    UtilityBills.classList.remove('active');
    MaintenanceBills.classList.remove('active');

    if (menuList === 'PropertyDocs') {
        menuIndicator.style.transform = 'translateX(0%) translateY(50%)';
        menuIndicator.style.bottom = '50%';
        PropertyDocs.classList.add('active');
        section1.style.transform = 'translateX(0%)';
        section2.style.transform = 'translateX(0%)';
        section3.style.transform = 'translateX(0%)';
    }
    else if (menuList === 'PropDailDocs') {
        menuIndicator.style.transform = 'translateX(100%) translateY(50%)';
        menuIndicator.style.bottom = '50%';
        PropDailDocs.classList.add('active');
        section1.style.transform = 'translateX(-100%)';
        section2.style.transform = 'translateX(-100%)';
        section3.style.transform = 'translateX(-100%)';
    }
    else if (menuList === 'UtilityBills') {
        menuIndicator.style.transform = 'translateX(0%) translateY(0%)';
        menuIndicator.style.bottom = '0%';
        UtilityBills.classList.add('active');
        section1.style.transform = 'translateX(-200%)';
        section2.style.transform = 'translateX(-200%)';
        section3.style.transform = 'translateX(-200%)';
    }
    else if (menuList === 'MaintenanceBills') {
        menuIndicator.style.transform = 'translateX(100%) translateY(0%)';
        menuIndicator.style.bottom = '0%';
        MaintenanceBills.classList.add('active');
        section1.style.transform = 'translateX(-200%)';
        section2.style.transform = 'translateX(-200%)';
        section3.style.transform = 'translateX(-200%)';
    }

}