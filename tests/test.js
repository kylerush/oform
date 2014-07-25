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

  test('global overrides', function(){

    ok(nativeFunc.overrideTestFunction(), 'executed');

  });

  test('beforeLocal function', function(){

    if(typeof nativeFunc.beforeLocal === 'function'){

      ok(nativeFunc.beforeLocal(), 'defined, executed');

    }

  });





});
