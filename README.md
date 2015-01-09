oForm [![Build Status](http://img.shields.io/travis/kylerush/oform.svg?style=flat)](https://travis-ci.org/kylerush/oform)
==============

> A lightweight handler for forms with no dependencies, not even jQuery. Compatible with IE8+.

## Install

Using Bower:

```
bower install oform --save
```

Or you can copy/paste the source in dist/oform.min.js.

##Overview

oform is a flexible form handler function. Core features:

* Handles XHR POST for you
* Client side validation for inputs
* Lots of callback functions
* Sensible default settings you can easily override

## Usage

Given this form:

```html
<form id="mailing-list" method="post" action="/email/list/join" novalidate>
  <input name="email" type="email" required>
  <input type="submit" value="Join email list">
</form>
```

Bare bones implementation:

```js
new Oform({
  selector: '#mailing-list'
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

## How it works

Given the usage example above, when the form is submitted, Oform will validate
the email field (since it has a required attribute) using a default validation
function (though you can specify a different function) and if valid it will POST
the data to `/email/list/join` and run the specified`on.load` function when
finished.

If the email address the user has entered is invalid, Oform will add/remove error
classes to the element and any element with a class of `[element.name]-related`
and it will not submit the form.

See below for all the supported options, event handlers, and methods.

### Notes

Oform currently has default validation functions for these types of inputs:

* email (checks for a real email)
* tel (removes non-digits, looks for at least 10 digits)
* url (looks for a non-empty string)
* checkbox
* text (looks for non-empty string)
* password (looks for non-empty string)

You can extend Oform to validate more input types by using the `customValidation`
option specified below.

## Options

#### selector

Type: `string`  
Required: yes
Default: none

The `<form>` tag of which you want to apply oform. The selector can match one
or many form tags. The string will be passed to document.querySelectorAll.

#### errorShowClass

Type: `string`  
Required: no
Default: `oform-error-show`

If the input is invalid Oform will add the errorShowClass. If the input is valid
Oform will remove the errorShowClass.

```js
new Oform({
  selector: '#mailing-list',
  errorShowClass: 'error-show'
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

#### customValidation

Type: `object`  
Required: no
Default: none

Provides the ability to specify custom validation functions. This is useful for things like
validating that the `[name='password']` field meets security requirements or validating
that the `[name='password']` and `[name='password-confirm']` fields are identical.

The object is a mapping of input name attribute and their custom validation function.
For example, if you want to provide a custom validation function for the [name='password']
field then you would have `password` as a property name in the object. The name of the
property is the value of the `name` HTML attribute of the input.

Each custom validation function is passed the HTML element of the input. The function switches
the error classes on the DOM based on the return value. In the following example,
if the `password` function return `false`, the `[name='password']` node and related fields
will get the `errorShownClass` added and the `errorHiddenClass` removed and vice-versa
if the return value is `true`.

```js
new Oform({
  selector: '#create-account',
  customValidation: {
    password: function(element){
      if(element.value.length >= 7){
        return true;
      } else {
        return false;
      }
    }
  }
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

####bodyErrorClass

Type: `string`
Required: no
Default: 'oform-error'

Oform can add a class to the `<body>` when validation errors occur and remove it
when no validation errors occur. You can customize the class:

```js
new Oform({
  selector: '#create-account',
  bodyErrorClass: 'custom-error-class'
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

You can also disable this behavior:

```js
new Oform({
  selector: '#create-account',
  bodyErrorClass: null
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

#### middleware

Type: `function`  
Required: no

Executes right before Oform runs XHR.send(). The function receives two arguments.
The first argument is the XHR object and the second is the data string that the
plugin will send with the POST request.

This function needs to return a data string or the plugin will error.

This is useful if you want to format, encode, etc. the data before it is sent or
if you want to modify the XHR object to add, say, custom headers.

```js
new Oform({
  selector: '#mailing-list',
  middleware: function(XhrObj, data){
    XhrObj.setRequestHeader('x-sent-with', 'oform');
    return encodeData(data);
  }
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

## Methods

### on

You can attach callback functions on all events using the `.on` method. See below
for examples.

#### before

Dispatches before oform does anything. If the function return false Oform will
stop executing. If the function returns either `true` or `undefined` Oform will
continue executing.

```js
new Oform({
  selector: '#mailing-list',
}).on('before', function(){
  //before anything happens
  return true;
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

### validationerror

Dispatches when a validation error occurs on a form field. This is useful if you
want to track validation errors with, say, Google Analytics or Optimizely.

```js
new Oform({
  selector: '#mailing-list'
}).on('validationerror', function(element){
    _gaq.push(
      ['_trackEvent', 'form error', 'mailing list', element.getAttribute('name')]
    );
}).on('load', function(event){
  window.alert('Thank you for joining our email list!');
});
```

### xhr

You can specify handler functions for any XHR event. See [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Events)
 and [nsIXMLHttpRequestEventTarget](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIXMLHttpRequestEventTarget)
 for more information.

```js
new Oform({
  selector: '#mailing-list'
}).on('abort', function(){
  // A JavaScript function object that gets invoked if the operation is canceled by the user.
}).on('error', function(){
  // A JavaScript function object that gets invoked if the operation fails to complete due to an error.
}).on('load', function(returnData){
  // A JavaScript function object that gets invoked when the operation is successfully completed.
  //returnData.requestPayload = The values from the form
  //data.XHR = The XMLHttpRequest object
  //data.XHR.status = HTTP status code from the response
  //data.XHR.responseText = Response body as a string (use JSON.parse to turn it into an object)
}).on('loadend', function(){
  // A JavaScript function object that gets invoked when the operation is completed for any reason; it will always follow a an abort, error, or load event.
}).on('loadstart', function(){
  // A JavaScript function object that gets invoked exactly once when the operation begins.
}).on('progress', function(){
  // A JavaScript function object that gets invoked zero or more times, after the loadstart event, but before any abort, error, or load events occur.
});
```

##### Known browser support for XHR event

|  event    | Chrome  | Firefox | Safari 7+ |  IE10+  |  IE 9   |  IE 8   |
|-----------|---------|---------|-----------|---------|---------|---------|
| abort     |    ?    |    ?    |     ?     |    ?    |    ?    |    ?    |
| error     |    ?    |    ?    |     ?     |    ?    |    ?    |    ?    |
| load      |    √    |    √    |     √     |    √    |    √    |    √    |
| loadend   |    √    |    √    |     √     |    √    |    X    |    X    |
| loadstart |    √    |    √    |     √     |    √    |    X    |    X    |
| progress  |    √    |    √    |     ?     |    ?    |    ?    |    X    |

The `load` event is passed the `XMLHttpRequestObject`. Below is how a typical
object looks. Note that this object will look different in IE8 as IE8 doesn't
support many of the event handlers like onreadystatechange. In most cases you
will just need to work with the responseText and status properties of this object.

```js
onabort: null
onerror: function
onload: function
onloadend: null
onloadstart: null
onprogress: null
onreadystatechange: null
ontimeout: null
readyState: 4
response: "{"token":"c68714fcfb2a2f90c62add44ea3d120258e134f4","succeeded":true}↵"
responseText: "{"token":"c68714fcfb2a2f90c62add44ea3d120258e134f4","succeeded":true}↵"
responseType: ""responseURL: "http://0.0.0.0:9000/account/free_trial_create"
responseXML: null
status: 200
statusText: "OK"timeout: 0
upload: XMLHttpRequestUploadwithCredentials: false__proto__: XMLHttpRequest
```

### success

Dispatches when Oform has successfully validated the form and/or received a
response POST. If your form does not have a `method` attribute then Oform will
not POST the form data.

Generally speaking you should use this success method for handling POST request
responses instead of `.on('load')`.

Example with no `method` attribute on form:

```html
<form id="mailing-list" action="/email/list/join" novalidate>
  <input name="email" type="email" required>
  <input type="submit" value="Join email list">
</form>
```

```js
new Oform({
  selector: '#mailing-list'
}).on('success', function(){
  //The form was successfully validated
});
```

Example with a `method` attribute on form:

```html
<form id="mailing-list" method="post" action="/email/list/join" novalidate>
  <input name="email" type="email" required>
  <input type="submit" value="Join email list">
</form>
```

```js
new Oform({
  selector: '#mailing-list'
}).on('success', function(event, data){
  //The form was successfully validated and/or POST response was received
  //event = XMLHttpRequestProgressEvent (kept for backwards compatibility)
  //data.event = XMLHttpRequestProgressEvent
  //data.inputs = form inputs and their values
});
```

### done

Dispatches when the Oform instance has finished executing. This function receives
no arguments.

```js
new Oform({
  selector: '#mailing-list'
}).on('done', function(data){
  //Oform instance is completely finished executing
  //data = form inputs and their values
});
```

## remove

To remove the Oform instance listener from a form you need to first save the
Oform instance in a variable. Once the instance is in a variable, it can be removed
like this:

```js
var mailingList = new Oform({
  selector: '#mailing-list'
}).on('load', function(){
  window.alert('Thank you for joining our email list!');
});

mailingList.remove();
```

This effectively kills the instance of Oform for the `#mailing-list` form so
that you can add another Oform instance if necessary.

## Advanced usage

Coming soon.

## Contributing

Issues and pull requests are very much appreciated. If you plan on submitting a
pull request please open an issue first to discuss it.

When adding code, make sure that your code passes the existing tests, but also
create a new test. You can run the test suite by running `gulp dev` and visiting
http://0.0.0.0:8080/fixture/ in your browser. Please run the test suite in the
following browsers:

* Chrome
* Firefox
* Safari 7
* IE 11
* IE 10
* IE 9
