
var signInBtn = document.getElementById('signInBtn');
var signUpBtn = document.getElementById('signUpBtn');
var signInForm = document.getElementById('signInForm');
var signUpForm = document.getElementById('signUpForm');

signUpBtn.addEventListener('click', signUpBtnClick, false);

function signUpBtnClick(){
  signInForm.style.transform = 'translateX(-100%)';
  signUpForm.style.transform = 'translateX(-100%)';
};

signInBtn.addEventListener('click', signInBtnClick, false);

function signInBtnClick(){
  signInForm.style.transform = 'translateX(0%)';
  signUpForm.style.transform = 'translateX(0%)';
};
