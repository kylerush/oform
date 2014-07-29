/* global QUnit */
$(function(){

  var nativeFunc = $.oFormDefaultFunctions;

  QUnit.test('dummy test', function(){

    QUnit.assert.equal(true, true);

  });

  QUnit.test('email validation', function(){

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

      QUnit.assert.ok(nativeFunc.emailIsValid(validEmails[i]), validEmails[i]);

    }

    for(i=0; i <= invalidEmails.length - 1; i++){

      QUnit.assert.ok(!nativeFunc.emailIsValid(invalidEmails[i]), invalidEmails[i]);

    }

  });

  QUnit.test('phone is valid', function(){

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

        QUnit.assert.ok(nativeFunc.phoneIsValid(validPhones[i]), validPhones[i]);

      }

      for(i=0; i <= invalidPhones.length - 1; i++){

        QUnit.assert.ok(!nativeFunc.phoneIsValid(invalidPhones[i]), invalidPhones[i]);

      }

  });

  QUnit.test('string has value', function(){

    QUnit.assert.ok(nativeFunc.stringHasValue('foo'), 'actual string');

    QUnit.assert.ok(!nativeFunc.stringHasValue(''), 'blank string');

    QUnit.assert.ok(!nativeFunc.stringHasValue(3), 'number ');

  });

  QUnit.test('checkbox is valid', function(){

    var checkbox = $('#checkbox');

    checkbox.prop('checked', true);

    QUnit.assert.ok(nativeFunc.checkboxIsValid(checkbox), 'checkbox is checked');

    checkbox.prop('checked', false);

    QUnit.assert.ok(!nativeFunc.checkboxIsValid(checkbox), 'checkbox is not checked');

  });

  QUnit.test('global overrides', function(){

    QUnit.assert.ok(nativeFunc.overrideTestFunction(), 'executed');

  });

  QUnit.test('beforeLocal function', function(){

    if(typeof nativeFunc.beforeLocal === 'function'){

      QUnit.assert.ok(nativeFunc.beforeLocal(), 'defined, executed');

    }

  });

  QUnit.test('beforeGlobal function', function(){

    if(typeof nativeFunc.beforeGlobal === 'function'){

      QUnit.assert.ok(nativeFunc.beforeGlobal(), 'defined, executed');

    }

  });

  QUnit.test('check error/valid classes', function(){

    QUnit.assert.ok(!nativeFunc.validateFields({selector: $('form')}), 'validateFields returns false when fields are invalid');

    QUnit.assert.ok($('body').hasClass('error-state'), 'body error class present on error');

    QUnit.assert.ok((function(){

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

    QUnit.assert.ok(nativeFunc.validateFields({selector: $('form')}), 'validateFields returns true when fields are valid');

    QUnit.assert.ok((function(){

      var hasErrorClass = 0;

      $.each( $('form').find('input:not([type="hidden"])'), function(index, value){

        if( $(value).hasClass('error-show') ){

          hasErrorClass++;

        }

      });

      return hasErrorClass === 0 ? true : false;


    })(), 'no field has error-show class when all fields are valid');


  });

  QUnit.asyncTest('submit test', function(){

    QUnit.expect(2);

    $('form').attr('action', '/success');

    nativeFunc.submitData(function(){

      QUnit.assert.equal(window.afterLocalHasRun, 1, 'afterLocal executed');

      QUnit.assert.equal(window.afterGlobalHasRun, 1, 'afterGlobal executed');

      QUnit.start();

    });

  });

});
