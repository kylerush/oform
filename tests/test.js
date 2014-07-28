/* global test, ok, console */
$(function(){

  var nativeFunc = $.oFormDefaultFunctions;

  test('email validation', function(){

    var validEmails, invalidEmails, i;

    validEmails = [
      'kylerrush@gmail.com',
      'kylerrush+test@gmail.com',
      'kyle.r.rush@gmail.com'
    ];

    invalidEmails = [
      'kylerrush@gmail',
      '@gmail.com',
      '.kylerrush@gmail.com',
      'kylerrush.@gmail.com',
      'kylerrush@gmail..com',
      'kylerrush.gmail@com',
      3,
      {},
      [],
      undefined
    ];

    for(i=0; i <= validEmails.length - 1; i++){

      ok(nativeFunc.emailIsValid(validEmails[i]), validEmails[i]);

    }

    for(i=0; i <= invalidEmails.length - 1; i++){

      ok(!nativeFunc.emailIsValid(invalidEmails[i]), invalidEmails[i]);

    }

  });

  test('phone is valid', function(){

    var validPhones, invalidPhones, i;

    validPhones = [

      //usa
      '8002529480',
      '(800) 252-9480',
      '800-252-9480',
      '+1 (800) 252-9480',
      '1-800-252-9480',
      //germamy
      '+49 (0)30 56796902',
      //france
      '+33 (0) 9 70 40 63 33'

    ];

    invalidPhones = [

      123,
      [],
      {},
      undefined

    ];

      for(i=0; i <= validPhones.length - 1; i++){

        ok(nativeFunc.phoneIsValid(validPhones[i]), validPhones[i]);

      }

      for(i=0; i <= invalidPhones.length - 1; i++){

        ok(!nativeFunc.phoneIsValid(invalidPhones[i]), invalidPhones[i]);

      }

  });

  test('string has value', function(){

    ok(nativeFunc.stringHasValue('foo'), 'actual string');

    ok(!nativeFunc.stringHasValue(''), 'blank string');

    ok(!nativeFunc.stringHasValue(3), 'number ');

  });

  test('checkbox is valid', function(){

    var checkbox = $('#checkbox');

    checkbox.prop('checked', true);

    ok(nativeFunc.checkboxIsValid(checkbox), 'checkbox is checked');

    checkbox.prop('checked', false);

    ok(!nativeFunc.checkboxIsValid(checkbox), 'checkbox is not checked');

  });

  test('global overrides', function(){

    ok(nativeFunc.overrideTestFunction(), 'executed');

  });

  test('beforeLocal function', function(){

    if(typeof nativeFunc.beforeLocal === 'function'){

      ok(nativeFunc.beforeLocal(), 'defined, executed');

    }

  });

  test('beforeGlobal function', function(){

    if(typeof nativeFunc.beforeGlobal === 'function'){

      ok(nativeFunc.beforeGlobal(), 'defined, executed');

    }

  });

  test('check error/valid classes', function(){

    ok(!nativeFunc.validateFields({selector: $('form')}), 'validateFields returns false when fields are invalid');

    ok($('body').hasClass('error-state'), 'body error class present on error');

    ok((function(){

      var missingClass = 0;

      $.each( $('form').find('input:not([type="hidden"])'), function(index, value){

        if( !$(value).hasClass('error-show') ){

          missingClass++;

        }

      });

      return missingClass === 0 ? true : false;


    })(), 'all fields have error class when values are invalid');

    //enter valid data and verify that classes were removed

    $('#name').val('John Doe');

    $('#email').val('johndoe@jupiter.net');

    $('#url').val('http://kylerush.net');

    $('#phone').val('(760) 874-4483');

    $('#checkbox').prop('checked', true);

    ok(nativeFunc.validateFields({selector: $('form')}), 'validateFields returns true when fields are valid');

    ok((function(){

      var hasErrorClass = 0;

      $.each( $('form').find('input:not([type="hidden"])'), function(index, value){

        if( $(value).hasClass('error-show') ){

          hasErrorClass++;

        }

      });

      return hasErrorClass === 0 ? true : false;


    })(), 'no field has error-show class when all fields are valid');


  });

  //PLUGIN HASN'T ACTUALLY EXECUTED YET SO CAN'T DO THIS
  /*
  test('callback functions run after validation error', function(){

    ok(window.afterGlobalHasRun, 'afterGlobal executed after validation error');

    ok(window.afterLocalHasRun, 'afterLocal executed after validation error');

  });
  */

  //TO DO: verify that callback function fire after validation error

  //TO DO: validate custom validation function

});
