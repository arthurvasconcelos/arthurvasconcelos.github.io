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
//=============================================================================

function documentInfos() {
  return {
    scrollTop: window.pageYOffset || document.documentElement.scrollTop,
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    viewportHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    viewportWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  }
}

/**
 * [MainMenu Controller]
 * @type {[type]}
 */
const links = document.querySelectorAll('.main-header nav li a');
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    // e.preventDefault();
    e.target.setAttribute('class', 'active');
  });
});

/**
 * [Vitae Page Controller]
 * @type {[type]}
 */
const vitaePage = document.querySelector('.vitae-page');
if (vitaePage) {
  let skillsAnimated = false;

  function skillsController() {
    const skills = document.querySelectorAll('.bar-percentage[data-percentage]');
    skills.forEach((skill) => {
      const percentage = Math.ceil(skill.dataset.percentage);
      const interval = setInterval(frame, 25);
      let start = 0;

      function frame() {
        const progressBar = skill.nextElementSibling.children[0];
        let pct = start + '%';

        progressBar.style.width = pct;
        skill.innerHTML = pct;
        start++;

        if (start > percentage) {
          clearInterval(interval);
        }
      }
    });
  }

  function areSkillsOnScreen() {
    const docInfo = documentInfos();
    const skillsContainer = document.querySelector('.skills');
    const halfHeight = skillsContainer.offsetHeight / 2;

    if (docInfo.scrollTop + docInfo.viewportHeight >= skillsContainer.offsetTop + halfHeight && !skillsAnimated) {
      skillsController();
      skillsAnimated = true;
    }
  }

  window.addEventListener('scroll', areSkillsOnScreen);
}
