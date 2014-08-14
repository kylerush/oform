oForm [![Build Status](http://img.shields.io/travis/kylerush/oform.svg?style=flat)](https://travis-ci.org/kylerush/oform)
==============

> Lightweight jQuery plugin that handles form submissions in JavaScript.

##Install

```
bower install oform --save
```

##Overview

oForm catches the submit event on the form, prevents the default behavior and
then does the following:

* executes a `before` function if supplied
* executes a field validation function, if the fields are all valid, it
proceeds, if not, it stops
* submits the data using an $.ajax request
* executes an `after` function if supplied

See settings below for specifics on how each step works.

##Usage

Basic usage:

    $('form').oForm({url: '/whatever/path'});

Advanced usage:

    $('form').oForm({

        url: '/whatever/path',
        beforeLocal: function(){ alert('hello'); },
        afterLocal: function(){ alert('world!'); }

    });

##Settings

You must pass required settings to the oForm method. Required settings have
no default.

Settings that are not required have a default behavior which is described below.
You can override the default behavior by adding a property with the same key
as the setting name to the options object passed to oForm. Additionally, you can
globally override the settings by defining a jQuery.oFormGlobalOverrides before
the plugin executes as an object. That object will overwrite any methods with
the same name.

The advanced usage example above overrides the default behavior for the `before`
and `after` settings.

###url: string

The endpoint to which the form data with be POSTed. If this is not supplied
the plugin will grab use the value of the `action` attribute on the form tag.

**Note: the following validation functions are only executed if there is a
`required` attribute on the HTML dom node. If you want to run a validation
function on an HTML node that is not required, use the `validation` setting.**

###emailIsValid: function

Returns: `true` if the email is valid `false` if not.

This is the function that validates an email address. The function accepts one
argument and that is the string of the email address.

###phoneIsValid: function

Returns: `true` if the phone number is valid `false` if not.

This is the function that validates a phone number. The function accepts one
argument and that is the string of the phone number.

###checkboxIsValid: function

Returns: `true` if the checkbox is valid, `false` if not.

This is the function that validates a checkbox. The function accepts one
parameter and that is the checkbox DOM node.

###urlIsValid: function

Returns: `true` if the URL is valid, `false` if not.

This is the function that validates a URL. The function accepts one argument and
that is the string of the URL.

###textIsValid: function

Returns: `true` if the text is valid, `false` if not.

This is the function that validates a `[type='text']` input. The function
accepts one argument and that is the string of the node's value.

###adjustClasses: function

Returns: nothing

This function adds/removes error classes from DOM elements. It accepts two
arguments. The first argument is an HTML node. The second argument is a boolean
value indicating if the DOM node is valid or not.

For example, if the DOM node is `name="email` and the field is invalid, the
function will do the following:

* add an `error-show` class to any DOM node of `class="email-related"`

If the field is valid, the function will do the opposite:

* remove a `error-show` class to any DOM node of `class="email-related"`

###validateFields: function

This function validates all the form field values. If the form field has a
`required` attribute then the function will validate it. By default the function
uses the `type` attribute to decide how to validate the value of the node. For
example, for `type="email"` the plugin will use the validation.validators.email
function.

If you want a different behavior than the default, see the `validation` setting.

This function passes the return value from the specific validation function to
adjustClasses.

###validation

This settings has no default. It provides you a way to override the default
behavior for validating a form field.

If you want to override the default behavior to validate a text
input, you would do the following.

1. Add a `data-validation` attribute with a value of the validation function (see example)
2. Pass a `validation` property in the options object
3. Add a validation function in the `validation` property that accepts one argument,
which is the value of the form field

For example, if you want to provide a custom validation function for a text input,
your HTML should look like this:

    <input type="text" required data-validation="hair" name="hair-color">

And to initiate the jQuery plugin:

    $('form').oForm({  
      url: '/whatever-path',
      validation: {
        hair: function(value){
          if(value.length >= 3){
            return true;
          } else {
            return false;
          }
        }
      }
    });

###reportValidationError

This function is executed each time there is a validation error on a form field.
It gets passed one argument and that is the DOM node that was invalid. This is
useful to report validation errors to tracking platforms like Google Analytics.

###submitData

This function submits the form field data to the specified endpoint. It accepts
one argument which is a callback function to execute after the function is done.

###beforeSubmit

This function will be executed before the plugin submits the form data. If the
function returns `false` the plugin will stop executing. If the function returns
`true` it will continue executing.

###beforeGlobal and beforeLocal: function

These functions will be executed before any other plugin code is executed. If
either one of the functions return false then the plugin will not stop executing.
The local function runs before the global function.

The function is passed one argument which is an object. The object contains
one property named 'selector' and the value is the jQuery selector from when
the plugin was initiated.

###afterGlobal and afterLocal: function

Similar to the before functions, these functions will run after the plugin is
finished executing. This could be after validation errors occur or after the
plugin received data from the XHR request.

The local function executes first and is passed two arguments. The first is
the response object from the jQuery jqXHR object XHR request. If no request was made the value of this argument will be undefined.
The second argument is the afterGlobal function. If you have both an afterLocal
and afterGlobal function then you need to execute the afterGlobal function by
executing the argument when your afterLocal function is finished executing. This
is because technically the plugin is still executing while the localAfter
function is executing. If you don't have an afterGlobal function, this
argument's value will be undefined. If you have only a globalAfter function,
then plugin will execute it when it finishes since there is no localAfter
function.

Note: The plugin adds two additional properties to the jqXHR object. The first is responseJSON and the value is the
responseText formatted as JSON, assuming the response contained valid JSON. If
the response did not contain valid JSON, the responseJSON property will not be
defined. The second is requestInfo and the value is the settings object from the
.ajax function so that you have access to request header type data.

Use these functions to create your success or failure handlers.
