# Supportive Is

A very lightweight library to validate different things

## Installation

`npm i @mongez/supportive-is`

Or using Yarn

`yarn add @mongez/supportive-is`

## Usage

There are many data types here to be checked, but firstly let's import the package

```ts
import Is from '@mongez/supportive-is';

// use it
```

## Primitives

We've tons of primitives to be checked, here are some of them.

## Is.primitive

Check if the given value is a `string`, `number`, `boolean`, `null`, `undefined` or `symbol`

```ts
console.log(Is.primitive('hello')); // true
console.log(Is.primitive(22.5)); // true
console.log(Is.primitive(false)); // true
console.log(Is.primitive(null)); // true
console.log(Is.primitive(Symbol('SymbolKey'))); // true
console.log(Is.primitive(undefined)); // true
console.log(Is.primitive([])); // false
console.log(Is.primitive({})); // false
```

### Is.scalar

Check if the given value is a `string`, `number` or `boolean`

```ts
console.log(Is.scalar('hello')); // true
console.log(Is.scalar(22.5)); // true
console.log(Is.scalar(false)); // true
console.log(Is.scalar(null)); // false
console.log(Is.scalar(undefined)); // false
console.log(Is.scalar([])); // false
console.log(Is.scalar({})); // false
```

### Is.json

Check if the given value string is a valid json format

```ts
let value = '{"name":"Hasan","job":"Software Engineer"}';
console.log(Is.json(value)); // true
```

### Is.null

Check if the given value is null

```ts
let name = null;
console.log(Is.null(name)); // true

name = undefined;
console.log(Is.null(name)); // false
```

### Is.undefined

Check if the given value is undefined

```ts
let name = 'Hasan';
console.log(Is.undefined(name)); // false

let myVar; // any declared variable without a value will be treated as undefined
console.log(Is.undefined(myVar)); // true

let age = undefined;
console.log(Is.undefined(age)); // true
```

### Is.numeric

Check if the given value is a number whether if its data type is `String` or `Number`

```ts
let numberInt = 12;
console.log(Is.numeric(numberInt)); // true

let numberFloat = 12.55;
console.log(Is.numeric(numberFloat)); // true

let numberWrittenInString = '99';
console.log(Is.numeric(numberWrittenInString)); // true

let floatWrittenInString = '99.99';
console.log(Is.numeric(floatWrittenInString)); // true
```

### Is.number

Check if the given value is a number whether if its data type is `Number`

```ts
let numberInt = 12;
console.log(Is.number(numberInt)); // true

let numberFloat = 12.55;

console.log(Is.number(numberFloat)); // true

let numberWrittenInString = '99';

console.log(Is.number(numberWrittenInString)); // false

let floatWrittenInString = '99.99';

console.log(Is.number(floatWrittenInString)); // false
```

> The major difference between `Is.numeric` and `Is.number` is that `Is.numeric` will return true if the given value is a string that contains a number

### Is.int

Check if the given value is an integer and its data type is number

```ts
let number = 12;
console.log(Is.int(numberInt)); // true

let numberInString = '12';
console.log(Is.int(numberInString)); // false
```

### Is.float

Check if the given value is a float number and its data type is number

```ts
let number = 921;
console.log(Is.float(number)); // true

number = 82.42;
console.log(Is.float(number)); // true

let numberInString = '12';
console.log(Is.float(numberInString)); // false
```

### Is.string

Check if the given value is string

```ts
console.log(Is.string('this is a string')); // true
```

### Is.bool

Check if the given value is boolean

```ts
console.log(Is.bool(true)); // true
console.log(Is.bool(false)); // true
```

> Is.boolean is an alias for Is.bool

### Is.symbol

Check if the given value is a symbol

```ts

let mySymbol = Symbol('mySymbol');

console.log(Is.symbol(mySymbol)); // true
```

### Is.NaN

Check if the given value is Not a Number
This method works exactly same as isNaN as it is already implementing it xD.

```ts
let number = 76; // number int
console.log(Is.NaN(number)); // false

number = '76'; // string
console.log(Is.NaN(number)); // true
```

### Is.regex

Check if the given value is a regular expression

```ts

let regex = /hello/;

console.log(Is.regex(regex)); // true

let regexString = '/hello/';

console.log(Is.regex(regexString)); // false

let regexObject = new RegExp('hello');

console.log(Is.regex(regexObject)); // true
```

## Objects, Classes And Arrays

Now let's check some objects.

### Is.object

Check if the given value is an object

Any type of objects will be validated as true no matter its object type

> Arrays are types of objects so any passed array will be validated as true
> null values are considered objects in javascript, but it will be validated as false if provided.

```ts
let myObject = {};
console.log(Is.object(myObject)); // true

class myClass {}
let anotherObject = new myClass;
console.log(Is.object(myObject)); // true

let myArray = [];
console.log(Is.object(myArray)); // true

console.log(Is.object(null)); // false

// to check if the given value is an object but not an array
//you must mix between Is.object AND Is.array to avoid an array
if (Is.object(myVar) && ! Is.array(myVar)) {
    // do something with that object
}
```

### Is.plainObject

Check if the given value is a plain javascript object

```ts
// plain objects
let myObject = {};
console.log(Is.plainObject(myObject)); // true

// classes
class myClass {}
let anotherObject = new myClass;

console.log(Is.plainObject(myObject)); // false

// arrays
let myArray = [];

console.log(Is.plainObject(myArray)); // false

// null value
console.log(Is.plainObject(null)); // false
```

### Is.a

Check if the given value is an instance of the given class

```ts
class myClass {}

let myObject = new myClass;

console.log(Is.a(myObject, myClass)); // true
```

### Is.array

Check if the given value is an array

```ts
let myArray = [4 , 'hello', 9];
console.log(Is.array(myArray)); // true
```

### Is.iterable

Check if the given value is iterable

```ts

let myArray = [1, 2, 3];

console.log(Is.iterable(myArray)); // true

let myObject = {a: 1, b: 2, c: 3};

console.log(Is.iterable(myObject)); // true

let myString = 'hello';

console.log(Is.iterable(myString)); // true

let myNumber = 123;

console.log(Is.iterable(myNumber)); // false

let myBoolean = true;

console.log(Is.iterable(myBoolean)); // false

let myFunction = function() {};

console.log(Is.iterable(myFunction)); // false

let myNull = null;

console.log(Is.iterable(myNull)); // false

let myUndefined = undefined;

console.log(Is.iterable(myUndefined)); // false
```

It works fine as well with any class that implements the **Symbol.iterator** method

```ts

class myClass {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
}

let myObject = new myClass();

console.log(Is.iterable(myObject)); // true
```

### Is.empty

Check if the given value is empty.

> This is a kind of smart method that will validate the given value whether it is empty or not based on its type

```ts

// undefined values are considered empty
let value = undefined;
console.log(Is.empty(value)); // true

// null values are considered empty
value = null;
console.log(Is.empty(value)); // true

// Also any objects with no values are considered empty
value = {};
console.log(Is.empty(value)); // true

value.name = 'Hasan';
console.log(Is.empty(value)); // false

// Arrays
value = [];
console.log(Is.empty(value)); // true

value.push(12);
console.log(Is.empty(value)); // false

// The `Zero` is not considered as empty value
value = 0;
console.log(Is.empty(value)); // false
```

## Functions And Generators

### Is.function

Check if the given value is a function

```ts
function sum(x, y) {
    return x + y;
}

// you must pass the function name not the function call
console.log(Is.function(sum)); // true

// if you passed the function call it will be not a function in this situation
console.log(Is.function(sum(2, 3))); // false
```

> Is.callable is an alias for Is.function
> Is.fn is an alias for Is.function

### Is.generator

Check if the given value is a generator

```ts

function* myGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

let myGeneratorObject = myGenerator();

console.log(Is.generator(myGeneratorObject)); // true
```

### Is.native

Check if the given value is a native javascript function

```ts

let myFunction = function() {
    return 'hello world';
};

console.log(Is.native(myFunction)); // false

console.log(Is.native(Math.random)); // true
```

## Misc

### Is.url

Check if the given value is a valid url

```ts
let url = 'google.com';
console.log(Is.url(url)); // true

url = 'https://google.com';
console.log(Is.url(url)); // true

url = 'www.google.com';
console.log(Is.url(url)); // true
url = 'www.google.com:8080';
console.log(Is.url(url)); // true

url = 'www.google.com?q=hello+world';
console.log(Is.url(url)); // true

let url = 'google';
console.log(Is.url(url)); // false
```

### Is.email

Check if the given value string is a valid email

```ts
let myEmail = 'hassanzohdy@gmail.com';
console.log(Is.email(myEmail)); // true
```

### Is.date

Check if the given value is a date

```ts

let myDate = new Date();

console.log(Is.date(myDate)); // true
```

### Is.promise

Check if the given value is a promise

```ts

let myPromise = new Promise((resolve, reject) => {
    resolve('hello world');
});

console.log(Is.promise(myPromise)); // true
```

### Is.error

Check if the given value is an error

```ts
let myError = new Error('my error');

console.log(Is.error(myError)); // true
```

## DOM & Browser

### Is.dom

Check if the given value is a dom element

> Dom Elements are objects of **HTMLElement**, so any html element will be validated as true, something like **document.body**
> **document** and **window** are not validated as true as they are not part of the html elements

```ts
console.log(Is.dom(document)); // false

console.log(Is.dom(document.body)); // true
```

### Is.form

Check if the given value is a form element

```ts

let myForm = document.querySelector('form');

console.log(Is.form(myForm)); // true
```

> Is.formElement is an alias for Is.form

### Is.formData

Check if the given value is a form data

```ts
let myFormData = new FormData();

console.log(Is.formData(myFormData)); // true
```

### Is.browser

Check if current browser matches the given name

```ts
console.log(Is.browser('chrome'));
console.log(Is.browser('firefox'));
console.log(Is.browser('safari'));
console.log(Is.browser('opera'));
console.log(Is.browser('edge'));
console.log(Is.browser('ie'));
```

### Is.validHtmlId

Check if the given value is a valid html id

```ts

let id = 'myId';

console.log(Is.validHtmlId(id)); // true

id = 'myId-1';

console.log(Is.validHtmlId(id)); // true

id = 'myId-1-1';

console.log(Is.validHtmlId(id)); // true

id = 'myId-1-';

console.log(Is.validHtmlId(id)); // false
```

### Is.mobile.*

Check if current visitor is browsing from a sort-of mobile

> this property contains set of methods

```ts

// To check if user is browsing from an android device
if (Is.mobile.android()) {
    // do something
}

// To check if  user is browsing from an ios device
if (Is.mobile.ios()) {
    // do something
}

// To check if  user is browsing from an iphone
if (Is.mobile.iphone()) {
    // do something
}

// To check if  user is browsing from an ipad
if (Is.mobile.ipad()) {
    // do something
}

// To check if  user is browsing from an ipod
if (Is.mobile.ipod()) {
    // do something
}

// To check if  user is browsing from a windows mobile
if (Is.mobile.windows()) {
    // do something
}

// To check if user is browsing from any type of mobile
if (Is.mobile.any()) {
    // do something
}
```

### Is.desktop

Check if current visitor is browsing from a desktop device
> Please note that any non mobile type will be considered as desktop.

```ts
if (! Is.desktop()) {
    // do something
}
```

### Is.enabled.*

Check for variant data that are enabled in the browser

```ts
console.log(Is.enabled.cookies());
console.log(Is.enabled.localStorage());
console.log(Is.enabled.sessionStorage());
console.log(Is.enabled.indexedDB());
console.log(Is.enabled.webWorkers()); 
console.log(Is.enabled.serviceWorkers());
console.log(Is.enabled.notifications());
console.log(Is.enabled.pushNotifications());
console.log(Is.enabled.geoLocation()); // also geolocation is an alias (with lower L)
console.log(Is.enabled.webRTC());
console.log(Is.enabled.webAudio()); 
console.log(Is.enabled.microphone());
console.log(Is.enabled.camera());
console.log(Is.enabled.speechRecognition());
console.log(Is.enabled.speechSynthesis());
console.log(Is.enabled.fullScreen()); // also fullscreen is an alias (with lower S)
console.log(Is.enabled.vibration());
console.log(Is.enabled.touch());
console.log(Is.enabled.battery());
console.log(Is.enabled.fetch());
console.log(Is.enabled.history());
console.log(Is.enabled.darkMode()); // will validate prefers-color-scheme media query (dark mode)
console.log(Is.enabled.lightMode()); // will validate prefers-color-scheme media query (light mode)
console.log(Is.enabled.animation());
console.log(Is.enabled.transition());
```

## Tests

To run tests, run the following command

```bash
npm run test
```

OR

```bash
yarn test
```

## Change Log

- 1.0.7 (11 Oct 2022)
  - Added tests
  - Enhanced Documentation
  - Added more methods
