/**
 * MAIN JS FILE
 */

// const mainHeader = document.querySelector('.main-header');
// const ulNav = document.querySelector('.main-header nav ul');
// const marginSpacer = (mainHeader.clientHeight - ulNav.clientHeight) / 2;
// ulNav.style.margin = marginSpacer + 'px 0';

// console.log(mainHeader);
// console.log(ulNav);
// console.log(marginSpacer);

const links = document.querySelectorAll('.main-header nav li a');
links.forEach((ev) => {
  ev.addEventListener('click', (e) => {
    // e.preventDefault();
    e.target.setAttribute('class', 'active');
  });
});
