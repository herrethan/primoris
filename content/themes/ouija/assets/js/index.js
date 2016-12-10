// Ouija JS

(function ($, undefined) {
  "use strict";

  var $document = $(document);

  $document.ready(function () {

    $('#hamburger').on('click', function(e){
      e.preventDefault();
      $('body').toggleClass('nav-opened nav-closed');
    });

    $('#search-button').on('click', function(e){
      e.preventDefault();
      $('body').toggleClass('search-opened search-closed');
    })

    var $postContent = $('.post-content');
    $postContent.fitVids();
  });

})(jQuery);
