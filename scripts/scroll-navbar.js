window.onscroll = function() { enableSticky() };

var navbar = document.getElementById("navbar");

var sticky = navbar.offsetTop;

function enableSticky() {
  if (window.scrollY > sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}