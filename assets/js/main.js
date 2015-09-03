// Init ScrollReveal
var config = {
  // easing: 'hustle',
  reset:  true,
  delay:  'onload',
  vFactor: 0.90
}
window.sr = new scrollReveal(config);

var DOMdocument = $(document);
var DOMwindow = $(window);
DOMdocument.ready(function(){
  // Codes n' functions for Hotsite LandingPage
  var hotLandingPage = $('#hotLandingPage');
  if (hotLandingPage.length != 0) {
    // Max height control
    hotLandingPage.css('height', DOMdocument.height());
    window.onresize = function(event) {
      hotLandingPage.css('height', DOMdocument.height());
    }

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
});
