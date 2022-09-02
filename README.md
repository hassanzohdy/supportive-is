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

Check if the given value is a number whatever if its data type is String or Number

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

### Is.NaN

Check if the given value is Not a Number
This method works exactly same as isNaN as it is already implementing it xD.

```ts
let number = 76; // number int
console.log(Is.NaN(number)); // false

number = '76'; // string
console.log(Is.NaN(number)); // true
```

### Is.object

Check if the given value is an object

Any type of objects will be validates true no matter its object type

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

### Is.array

Check if the given value is an array

```ts
let myArray = [4 , 'hello', 9];
console.log(Is.array(myArray)); // true
```

### Is.jquery

Check if the given value is a jquery object

```ts
let body = $('body');
console.log(Is.jquery(body)); // true
```

### Is.dom

Check if the given value is a dom element

> Dom Elements are objects of **HTMLElement**, so any html element will be validated as true, something like **document.body**
> **document** and **window** are not validated as true as they are not part of the html elements

```ts
console.log(Is.dom(document)); // false

console.log(Is.dom(document.body)); // true
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

### Is.json

Check if the given value string is a valid json format

```ts
let value = '{"name":"Hasan","job":"Software Engineer"}';
console.log(Is.json(value)); // true
```

### Is.url

Check if the given value is a valid url

```ts
let url = 'google.com';
console.log(Is.url(url)); // true

url = 'https://google.com';
console.log(Is.url(url)); // true

url = 'www.google.com';
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

### Is.cookieEnabled

Check if cookies are enabled in the browser

```ts
if (! Is.cookeEnabled()) {
    // Oops!, cookies are not enabled!
}
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
if (! Is.cookeEnabled()) {
    // Oops!, cookies are not enabled!
}
```
