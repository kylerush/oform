oForm [![Build Status](http://img.shields.io/travis/kylerush/oform.svg?style=flat)](https://travis-ci.org/kylerush/oform)
==============

> A lightweight handler for forms with no dependencies. Compatible with IE9+.

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

Dispatches before oform does anything. If the function return false oform will
stop executing.

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
}).on('load', function(response){
  // A JavaScript function object that gets invoked when the operation is successfully completed.
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
| abort     |    ?    | ?       | ?         | ?       | ?       | ?       |
| error     |    ?    |    ?    |     ?     |    ?    |    ?    |    ?    |
| load      |    √    |    √    |     √     |    √    |    √    |    ?    |
| loadend   |    √    |    √    |     √     |    √    |    X    |    ?    |
| loadstart |    √    |    √    |     √     |    √    |    X    |    ?    |
| progress  |    √    |    √    |     ?     |    ?    |    ?    |    ?    |

The `load` event is passed an `XMLHttpRequestProgressEvent`. I can't find any
documentation on this event to link you to, but in Chrome, here is how a typical
successful response looks:

```js
XMLHttpRequestProgressEvent {
  bubbles: false,
  cancelBubble: false,
  cancelable: true,
  clipboardData: undefined,
  currentTarget: {
    onabort: null,
    onerror: null,
    onload: function(){}
    onloadstart: null,
    onpregress: null,
    onreadystatechange: null,
    ontimeout: null,
    readyState: 4,
    response: "", //if you specify a data type then this will be formatted as that and not a string
    responeText: "", //the response body as a string, you will need to JSON.parse
    responseType: "",
    responseURL: "http://0.0.0.0:8080/success",
    responseXML: null,
    status: 200,
    statusText: "OK",
    timeout: 0,
    upload: {},
    withCredentials: false
  },
  defaultPrevented: false,
  eventPhase: 0,
  lengthComputable: false,
  loaded: 844,
  path: NodeList[0],
  position: 844,
  returnValue: true,
  srcElement: {
    onabort: null,
    onerror: null,
    onload: function(){}
    onloadstart: null,
    onpregress: null,
    onreadystatechange: null,
    ontimeout: null,
    readyState: 4,
    response: "", //if you specify a data type then this will be formatted as that and not a string
    responeText: "", //the response body as a string, you will need to JSON.parse
    responseType: "",
    responseURL: "http://0.0.0.0:8080/success",
    responseXML: null,
    status: 200,
    statusText: "OK",
    timeout: 0,
    upload: {},
    withCredentials: false
  },
  target: {
    onabort: null,
    onerror: null,
    onload: function(){}
    onloadstart: null,
    onpregress: null,
    onreadystatechange: null,
    ontimeout: null,
    readyState: 4,
    response: "",
    response: "", //if you specify a data type then this will be formatted as that and not a string
    responeText: "", //the response body as a string, you will need to JSON.parse
    responseURL: "http://0.0.0.0:8080/success",
    responseXML: null,
    status: 200,
    statusText: "OK",
    timeout: 0,
    upload: {},
    withCredentials: false
  },
  timeStamp: 1410547973794,
  total: 0,
  totalSize: 0,
  type: 'load'
}
```

### done

Dispatches when the Oform instance has finished executing. This function receives
no arguments.

```js
new Oform({
  selector: '#mailing-list'
}).on('done', function(){
  //Oform instance is completely finished executing
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
