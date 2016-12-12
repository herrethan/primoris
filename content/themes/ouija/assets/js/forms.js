(function ($, undefined) {
  "use strict";

  var $document = $(document);

  $document.ready(function () {

    var $form = $('.post-content > form');
    var $requireds = $form.find('[required]');
    var $submit = $('#submit');
    var $inputs = $form.find('[name]');
    var $successMessage = $('#success-message');
    var $errorMessage = $('#error-message');

    $form.prepend('<p><span class="danger">*</span> Denotes a required field</p>');

    $requireds.each(function(i, el){
      var field = $(el).attr('name');
      $('label[for="'+field+'"]').append(' <span class="danger">*</span>');
    });

    $submit.on('click', function(e){
      e.preventDefault();
      $errorMessage.hide();
      $successMessage.hide();

      var formBody = {};
      var errors = false;

      $requireds.each(function(i, el){
        if(!$(el).val()) errors = true;
      });

      if(errors){
        $errorMessage.show();
        return;
      }

      $inputs.each(function(i, el){
        var key = $(el).attr('name');
        var val = $(el).val();
        formBody[key] = val;
      });

      $submit.text('Sending...')
      $submit.prop('disabled', true);

      $.post('/ghost/api/v0.1/apply', {
        form: formBody,
        recaptcha: $('.g-recaptcha-response').val()
      }).done(function(res){
        var res = JSON.parse(res);
        if(res.success){
          $successMessage.show();
          $submit.hide();
          $inputs.each(function(i, el){
            $(el).val('');
          });
        } else if(res.reason == 'Captcha failed') {
          $errorMessage.show();
          $submit.prop('disabled', false);
          $errorMessage.append('You must also confirm you are not a robot.');
        }
      }).fail(function(res){
        console.log('failed to submit', res);
      });
    });

  });

})(jQuery);
