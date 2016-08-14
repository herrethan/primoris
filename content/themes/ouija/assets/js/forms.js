// Ouija Forms JS

(function ($, undefined) {
  "use strict";

  var $document = $(document);

  $document.ready(function () {

    $('#submit').on('click', function(e){
      e.preventDefault();

      $.post('/ghost/api/v0.1/apply', {
        name: $('input[name="name"]').val(),
        email: $('input[name="email"]').val(),
        phone: $('input[name="phone"]').val()
      }).done(function(a){
        console.log('yah', a);
      }).fail(function(a){
        console.log('no', a);
      });
    });

  });

})(jQuery);
