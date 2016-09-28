// Init ScrollReveal
// var config = {
//   // easing: 'hustle',
//   reset:  true,
//   delay:  'onload',
//   vFactor: 0.90
// }
// window.sr = new scrollReveal(config);

function Shuffle(o) {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

var DOMdocument = $(document);
var DOMwindow = $(window);

DOMdocument.ready(function(){
  // Codes n' functions for Hotsite LandingPage
  var hotLandingPage = $('#hotLandingPage');
  if (hotLandingPage.length != 0) {
    // Max height control
    hotLandingPage.css('min-height', DOMdocument.height());
    window.onresize = function(event) {
      hotLandingPage.css('min-height', DOMdocument.height());
    };

    // Content vertical centralize
    var hlpSegContainer = $('.js-vert-centralize');
    hlpSegContainer.css({
      'margin-top': hlpSegContainer.height() / 2 * (-1)
      // 'margin-left': hlpSegContainer.width() / 2 * (-1)
    });

    // Socialbar centralize
    var socialbar = $('.socialbar');
    var socialbarWidth = 0;
    var socialbarHeight = 0;

    socialbar.find('li').each(function(){
      socialbarWidth += $(this).outerWidth(true);
      socialbarHeight = $(this).outerHeight(true);
    });

    socialbar.css({
      'max-width': socialbarWidth + parseInt(socialbar.css('padding')) * 2,
      'min-height': socialbarHeight + parseInt(socialbar.css('padding')) * 2
    });
  }

  var wrapper = $('#wrapper');
  if (wrapper.length != 0) {
    /*
     * Menu Controller
     */

    //set some variables
    var isAnimating = false
      , firstLoad = false
      , newScaleValue = 1;

    //cache DOM elements
    var dashboard   = $('#mainNavigation')
      , mainContent = $('#wrapper')
      , loadingBar  = $('#loadingBar');

    //select a new section
    dashboard.on('click', 'li a', function(event){
      event.preventDefault();
      var target = $(this),
        //detect which section user has chosen
        sectionTarget = target.data('menu');
        if( !target.hasClass('selected') && !isAnimating ) {
        //if user has selected a section different from the one alredy visible - load the new content
        triggerAnimation(sectionTarget, true);
      }

      firstLoad = true;
    });

    //detect the 'popstate' event - e.g. user clicking the back button
    $(window).on('popstate', function() {
      if (firstLoad) {
        /*
        Safari emits a popstate event on page load - check if firstLoad is true before animating
        if it's false - the page has just been loaded
          */
        var newPageArray = location.pathname.split('/'),
          //this is the url of the page to be loaded
          newPage = newPageArray[newPageArray.length - 1].replace('.html', '');
          if( !isAnimating ) triggerAnimation(newPage, false);
        }

        console.log('newPageArray: ', newPageArray);
        console.log('newPage: ', newPage);

        firstLoad = true;
      });

      //scroll to content if user clicks the .scrollToContent icon
      mainContent.on('click', '.scrollToContent', function(event){
        event.preventDefault();
        var scrollId = $(this.hash);
        $(scrollId).velocity('scroll', { container: $(".containerSection") }, 200);
      });

    //start animation
    function triggerAnimation(newSection, bool) {
      isAnimating =  true;
      newSection = ( newSection == '' ) ? 'index' : newSection;

      //update dashboard
      dashboard.find('*[data-menu="'+newSection+'"]').addClass('selected').parent('li').siblings('li').children('.selected').removeClass('selected');
      //trigger loading bar animation
      initializeLoadingBar(newSection);
      //load new content
      loadNewContent(newSection, bool);
    }

    function initializeLoadingBar(section) {
      var selectedItem =  dashboard.find('.selected'),
      barHeight = selectedItem.outerHeight(),
      barTop = selectedItem.offset().top,
      windowHeight = $(window).height(),
      maxOffset = ( barTop + barHeight/2 > windowHeight/2 ) ? barTop : windowHeight- barTop - barHeight,
      scaleValue = ((2*maxOffset+barHeight)/barHeight).toFixed(3)/1 + 0.001;

      console.log('selectedItem: ', selectedItem);

      //place the loading bar next to the selected dashboard element
      loadingBar.data('scale', scaleValue).css({
        height: barHeight,
        top: barTop
      }).attr('class', '').addClass('loading '+section);
    }

    function loadNewContent(newSection, bool) {
      setTimeout(function(){
        //animate loading bar
        loadingBarAnimation();

        //create a new section element and insert it into the DOM
        var section = $('<section class="containerSection overflow-hidden '+newSection+'"></section>').appendTo(mainContent);

        console.log("section: ", section);

        //load the new content from the proper html file
        var selector = (newSection === "index") ? newSection : newSection + '/index';
        section.load(selector + '.html .containerSection > *', function(event){
          //finish up the animation and then make the new section visible
          var scaleMax = loadingBar.data('scale');

          console.log("scaleMax: ", scaleMax);

          loadingBar.velocity('stop').velocity({
            scaleY: scaleMax
          }, 400, function(){
            //add the .visible class to the new section element -> it will cover the old one
            section.prev('.visible').removeClass('visible').end().addClass('visible').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
              resetAfterAnimation(section);
            });

            //if browser doesn't support transition
            if( $('.no-csstransitions').length > 0 ) {
              resetAfterAnimation(section);
            }

            console.log("newSection: ", newSection);

            var url = (newSection === "index") ? '/' : '/' + newSection;

            console.log("url: ", url);

            if(url!=window.location && bool){
              //add the new page to the window.history
              //if the new page was triggered by a 'popstate' event, don't add it
              window.history.pushState({path: url},'',url);
            }

            checkViewsToAnimate();
          });
        });
      }, 50);
    }

    function loadingBarAnimation() {
      var scaleMax = loadingBar.data('scale');
      if( newScaleValue + 1 < scaleMax) {
        newScaleValue = newScaleValue + 1;
      } else if ( newScaleValue + 0.5 < scaleMax ) {
        newScaleValue = newScaleValue + 0.5;
      }

      loadingBar.velocity({
        scaleY: newScaleValue
      }, 100, loadingBarAnimation);
    }

    function resetAfterAnimation(newSection) {
      //once the new section animation is over, remove the old section and make the new one scrollable
      newSection.removeClass('overflow-hidden').prev('.containerSection').remove();
      isAnimating =  false;
      //reset your loading bar
      resetLoadingBar();
    }

    function resetLoadingBar() {
      loadingBar.removeClass('loading').velocity({
        scaleY: 1
      }, 1);
    }

    /* End Menu Controller */

   function startElementAnimation(containerSelector, elementToAnimateSelector, animationClass) {
      var $animation_elements = $(elementToAnimateSelector);

      function check_if_in_view() {
        var window_height = DOMwindow.height();
        var window_top_position = DOMwindow.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animation_elements, function() {
          var $element = $(this);
          var element_height = $element.outerHeight();
          var element_top_position = $element.offset().top;
          var element_bottom_position = (element_top_position + element_height);

          //check to see if this current container is within viewport
          if ((element_bottom_position >= window_top_position) &&
              (element_top_position <= window_bottom_position)) {
            $element.addClass(animationClass);
          } else {
            $element.removeClass(animationClass);
          }
        });
      }

      $(containerSelector).on('scroll resize', check_if_in_view).trigger('scroll');
    }

    function checkViewsToAnimate() {
      if ($('.containerSection.index').length > 0) {
        startElementAnimation('.containerSection.index.visible', '.skillList li svg', 'animate');
      }
    }

    checkViewsToAnimate();
  }
});
