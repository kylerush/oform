/* global QUnit, Oform */
$(function(){

  var w = window;

  w.beforeTest = false;

  var nodeList2Array = function (nodes){

    var arr = [];

    for(var i = 0, n; n = nodes[i]; ++i){

      arr.push(n);

    }

    return arr;

  };

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

      target: document.getElementById('#form3'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.ok($('#form3 input.email').hasClass('oform-error-show'), 'custom validation worked');

      QUnit.start();

    }, 500);

  });

  // QUnit.asyncTest('test no attribute method on form', function(){
  //
  //   //QUnit.expect(2);
  //
  //   w.noSubmissionSubmit = false;
  //
  //   w.noSubmissionSuccess = false;
  //
  //   $('#form9 .email').val('form6@test.com');
  //
  //   $('#form9 .name').val('jane doe');
  //
  //   $('#form9 .url').val('http://www.google.com');
  //
  //   $('#form9 .phone').val('6489589837');
  //
  //   $('#form9 .checkbox').attr('checked', true);
  //
  //   new Oform({
  //
  //     selector: '#form9'
  //
  //   }).on('load', function(){
  //
  //     w.noSubmissionSubmit = true;
  //
  //   }).on('success', function(){
  //
  //     w.noSubmissionSuccess = true;
  //
  //   }).run({
  //
  //     target: document.getElementById('form9'),
  //
  //     preventDefault: function(){}
  //
  //   });
  //
  //   setTimeout(function(){
  //
  //     QUnit.assert.ok(!w.noSubmissionSubmit, 'form didn\'t POST');
  //
  //     QUnit.assert.ok(w.noSubmissionSuccess, 'success function executed');
  //
  //     QUnit.start();
  //
  //   }, 1000);
  //
  // });

  QUnit.asyncTest('option: middleware', function(){

    QUnit.expect(3);

    new Oform({

      selector: '#form4',

      middleware: function(XhrObj){

        XhrObj.setRequestHeader('x-requested-with', 'Oform');

        return 'middleware=success';

      }

    }).on('load', function(response){

      w.middlewareData = JSON.parse(response.target.responseText);

    }).on('success', function(response){

      w.middlewareDataSuccess = JSON.parse(response.target.responseText);

    }).run({

      target: document.getElementById('form4'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      QUnit.assert.equal(w.middlewareData.headers['x-requested-with'], 'Oform', 'middleware headers worked');

      QUnit.assert.equal(w.middlewareData.success, true, 'middleware xhr.load data succcess');

      //test that the success method function works as expeected
      QUnit.assert.equal(w.middlewareDataSuccess.success, true, 'middleware success data succcess');

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

    window.form6 = new Oform({

      selector: '#form6'

    }).on('before', function(){
      //purposely blank so that the function returns undefined
      //this is to test that oform proceeds on either true or undefined
    }).on('load', function(var1, var2){

      w.loadTest = true;

    }).on('loadend', function(){

      w.loadendTest = true;

    }).on('loadstart', function(){

      w.loadStartTest = true;

    }).on('done', function(){

      w.doneTest = true;

    }).on('success', function(event, data){

      w.successTest = data.data;

    }).run({

      target: document.getElementById('form6'),

      preventDefault: function(){}

    });

    setTimeout(function(){

      var fields = document.querySelectorAll('#form6 input[required]');

      fields = nodeList2Array(fields);

      for(var i = 0; i < fields.length; i++){

        QUnit.assert.equal(fields[i].getAttribute('required'), '', fields[i].getAttribute('name') + ' onvalidationerror worked correctly');

      }

      QUnit.assert.ok(w.loadTest, 'xhr.load worked');

      QUnit.assert.ok(w.loadendTest, 'xhr.loadend worked (fails in IE < 10)');

      QUnit.assert.ok(w.loadStartTest, 'xhr.loadstart worked  (fails in IE < 10)');

      QUnit.assert.ok(w.doneTest, 'on.done worked');

      //QUnit.assert.equal(w.successTest.email, 'form6@test.com', 'form data argument worked');

      QUnit.assert.ok(!$('#form6 .name').hasClass(w.form6.options.errorShowClass), 'remove error class worked');

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

    QUnit.expect(4);

    w.invalidFieldsTest = true;

    w.validationErrors = [];

    w.form7 = new Oform({

      selector: '#form7'

    }).on('validationerror', function(element){

      w.validationErrors.push(element.getAttribute('name'));

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

      QUnit.assert.ok($('#form7 .name').hasClass(w.form7.options.errorShowClass), 'add error class worked');

      QUnit.assert.ok($('body').hasClass(w.form7.options.bodyErrorClass), 'body error class worked');

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
