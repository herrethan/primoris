// Ouija JS

(function ($, undefined) {
  "use strict";

  var $document = $(document);

  $document.ready(function () {

    $('.hamburger, .nav-cover, .nav-close').on('click', function(e){
      e.preventDefault();
      $('body').toggleClass('nav-opened nav-closed');
    });

  });

})(jQuery);
