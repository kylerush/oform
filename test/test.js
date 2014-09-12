/* global QUnit, Oform */
$(function(){

  var w = window;

  w.beforeTest = false;

  var firstForm = new Oform({

    selector: '#form1',

    before: function(){

      w.beforeTest = true;

      return false;

    }

  });

  var secondForm = new Oform({

    selector: '#form2',

    errorHiddenClass: 'error-hidden-i',

    errorShownClass: 'error-show-i'

  });

  //w.window.console.log(firstForm);

  //w.window.console.log(secondForm);

  QUnit.test('initializations', function(){

    QUnit.expect(1);

    QUnit.assert.equal(secondForm.options.errorHiddenClass, 'error-hidden-i', 'instance override works');

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
      'kylerrush.gmail@com'
    ];

    QUnit.expect(validEmails.length + invalidEmails.length);

    for(i=0; i <= validEmails.length - 1; i++){

      QUnit.assert.ok(firstForm.options.validate.email(validEmails[i]), validEmails[i]);

    }

    for(i=0; i <= invalidEmails.length - 1; i++){

      QUnit.assert.ok(!firstForm.options.validate.email(invalidEmails[i]), invalidEmails[i]);

    }

  });

  QUnit.test('phone validation', function(){

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
      '123'
    ];

    QUnit.expect(validPhones.length + invalidPhones.length);

    for(i=0; i <= validPhones.length - 1; i++){

      QUnit.assert.ok(firstForm.options.validate.tel(validPhones[i]), validPhones[i]);

    }

    for(i=0; i <= invalidPhones.length - 1; i++){

      QUnit.assert.ok(!firstForm.options.validate.tel(invalidPhones[i]), invalidPhones[i]);

    }

  });

  QUnit.test('string validation', function(){

    QUnit.expect(2);

    var name = document.querySelector('#form1 input[name="name"]');

    name.value = 'test';

    QUnit.assert.ok(firstForm.options.validate.text(name), 'has value');

    name.value = '';

    QUnit.assert.ok(!firstForm.options.validate.text(name), 'blank string');

  });

  QUnit.test('checkbox validation', function(){

    QUnit.expect(2);

    var checkbox = document.querySelector('#form1 .checkbox');

    checkbox.checked = true;

    QUnit.assert.ok(firstForm.options.validate.checkbox(checkbox), 'checkbox is checked');

    checkbox.checked = false;

    QUnit.assert.ok(!firstForm.options.validate.checkbox(checkbox), 'checkbox is not checked');

  });

  QUnit.asyncTest('option: before', function(){

    QUnit.expect(2);

    firstForm.run({

      target: document.getElementById('form1'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok(w.beforeTest, 'before function executed');

      QUnit.assert.ok(!$('#form1 input.name').hasClass('error-show'), 'form did not submit');

      QUnit.start();

    }, 500);

  });

  QUnit.asyncTest('option: customValidation', function(){

    QUnit.expect(1);

    $('#form3 .email').val('test@test.com');

    new Oform({

      selector: '#form3',

      customValidation: {

        email: function(){

          return false;

        }

      }

    }).run({

      target: document.getElementById('form3'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok($('#form3 input.email').hasClass('error-show'), 'custom validation worked');

      QUnit.start();

    }, 500);

  });

  QUnit.asyncTest('option: middleware', function(){

    QUnit.expect(2);

    new Oform({

      selector: '#form4',

      middleware: function(XhrObj){

        XhrObj.setRequestHeader('x-requested-with', 'Oform');

        return 'middleware=success';

      }

    }).on('load', function(response){

      w.middlewareData = JSON.parse(response.target.responseText);

    }).run({

      target: document.getElementById('form4'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.equal(w.middlewareData.headers['x-requested-with'], 'Oform', 'middleware headers worked');

      QUnit.assert.equal(w.middlewareData.middleware, 'success', 'middleware data succcess');

      QUnit.start();

    }, 500);

  });

  QUnit.asyncTest('testing on handlers', function(){

    $('#form6 .email').val('form6@test.com');

    $('#form6 .name').val('jane doe');

    $('#form6 .url').val('http://www.google.com');

    $('#form6 .phone').val('6489589837');

    $('#form6 .checkbox').attr('checked', true);

    w.loadTest = false;

    w.loadendTest = false;

    w.loadStartTest = false;

    w.doneTest = false;

    window.form5 = new Oform({

      selector: '#form6'

    }).on('load', function(){

      w.loadTest = true;

    }).on('loadend', function(){

      w.loadendTest = true;

    }).on('loadstart', function(){

      w.loadStartTest = true;

    }).on('done', function(){

      w.doneTest = true;

    }).run({

      target: document.getElementById('form6'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      var fields = document.querySelectorAll('#form6 input[required]');

      fields = Array.prototype.slice.call(fields);

      fields.forEach(function(input){

        QUnit.assert.equal(input.getAttribute('required'), '', input.getAttribute('name') + ' onvalidationerror worked correctly');

      });

      QUnit.assert.ok(w.loadTest, 'xhr.load worked');

      QUnit.assert.ok(w.loadendTest, 'xhr.loadend worked');

      QUnit.assert.ok(w.loadStartTest, 'xhr.loadstart worked');

      QUnit.assert.ok(w.doneTest, 'on.done worked');

      QUnit.start();

    }, 500);

  });


  QUnit.asyncTest('remove method', function(){

    w.doneTest = false;

    var form6 = new Oform({

      selector: '#form6'

    }).on('done', function(){

      w.doneTest = true;

    });

    form6.remove();

    $('form6').submit();

    setTimeout(function(){

      QUnit.assert.ok(!w.doneTest, 'remove method worked');

      QUnit.start();

    }, 500);

  });

  QUnit.asyncTest('validation errors test', function(){

    QUnit.expect(2);

    w.invalidFieldsTest = true;

    w.validationErrors = [];

    new Oform({

      selector: '#form7'

    }).on('validationerror', function(){

      w.validationErrors.push('error');

    }).on('load', function(){

      w.invalidFieldsTest = false;

    }).on('done', function(){

    }).run({

      target: document.getElementById('form7'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok(w.invalidFieldsTest, 'form didn\'t submit with errors');

      QUnit.assert.equal(w.validationErrors.length, 5, 'on validationerror worked');

      QUnit.start();

    }, 500);

  });

  QUnit.asyncTest('before false, no validation errors, no submit', function(){

    QUnit.expect(1);

    w.beforeFalseNoErrorsNoSubmit = true;

    new Oform({

      selector: '#form8'

    }).on('before', function(){

      return false;

    }).on('load', function(){

      w.beforeFalseNoErrorsNoSubmit = false;

    }).run({

      target: document.getElementById('form8'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok(w.beforeFalseNoErrorsNoSubmit, 'form didn\'t submit');

      QUnit.start();

    }, 500);

  });

});
