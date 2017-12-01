# Supportive Is

This is a very lightweight library to validate different things

# Install

**1. Download the package and extract it**
**2. Create new script tag before the end of the body and set the path for the js file**
 ``` html
<script src="path-to-is.min.js"></script>
 ```

# Dependencies

> **No dependencies required to use this library**

## Usage

> **You can call any function in the *Is* object using `Is.method` in anywhere in your script**
                                       |
#### Data Types

There are many data types here to be checked

#### Is.null

Check if the given value is null

``` javascript
let name = null;
console.log(Is.null(name)); // true
name = undefined;
console.log(Is.null(name)); // false
```

#### Is.undefined
Check if the given value is undefined
``` javascript
let name = 'Hasan';
console.log(Is.undefined(name)); // false
let myVar; // any declared variable without a value will be treated as undefined
console.log(Is.undefined(myVar)); // true
let age = undefined;
console.log(Is.undefined(age)); // true
```

#### Is.numeric

Check if the given value is a number whatever if its data type is String or Number

``` javascript
let numberInt = 12;
console.log(Is.numeric(numberInt)); // true
let numberFloat = 12.55;
console.log(Is.numeric(numberFloat)); // true
let numberWrittenInString = '99';
console.log(Is.numeric(numberWrittenInString)); // true
let floatWrittenInString = '99.99';
console.log(Is.numeric(floatWrittenInString)); // true
```

#### Is.int
Check if the given value is an integer and its data type is number
``` javascript
let number = 12;
console.log(Is.int(numberInt)); // true
let numberInString = '12';
console.log(Is.int(numberInString)); // false
```

#### Is.float

Check if the given value is a float number and its data type is number

``` javascript
let number = 921;
console.log(Is.float(number)); // true
number = 82.42;
console.log(Is.float(number)); // true
let numberInString = '12';
console.log(Is.float(numberInString)); // false
```

#### Is.NaN
Check if the given value is Not a Number
This method works exactly same as isNaN as it is already implementing it xD.
``` javascript
let number = 76; // number int
console.log(Is.NaN(number)); // false
number = '76'; // string
console.log(Is.NaN(number)); // true
```

#### Is.object

Check if the given value is an object

Any type of objects will be validates true no matter its object type

> Arrays are types of objects so any passed array will be validated as true

``` javascript
let myObject = {};
console.log(Is.object(myObject)); // true
class myClass {}
let anotherObject = new myClass;
console.log(Is.object(myObject)); // true
let myArray = [];
console.log(Is.object(myArray)); // true
// to check if the given value is an object but not an array
//you must mix between Is.object AND Is.array to avoid an array
if (Is.object(myVar) && ! Is.array(myVar)) {
    // do something with that object
}
```

#### Is.array

Check if the given value is an array

``` javascript
let myArray = [4 , 'hello', 9];
console.log(Is.array(myArray)); // true
```

#### Is.jquery

Check if the given value is a jquery object

``` javascript
let body = $('body');
console.log(Is.jquery(body)); // true
```

#### Is.dom

Check if the given value is a dom element

> Dom Elements are objects of **HTMLElement**, so any html element will be validated as true, something like **document** object

``` javascript
console.log(Is.dom(document)); // true
let myForm = document.getElementById('my-form');
console.log(Is.dom(document.body)); // true
```

#### Is.dom

Check if the given value is a dom element

> Dom Elements are objects of **HTMLElement**, so any html element will be validated as true, something like **document.body**

> **document** and **window** are not validated as true as they are not part of the html elements

``` javascript
console.log(Is.dom(document)); // true
let myForm = document.getElementById('my-form');
console.log(Is.dom(document.body)); // true
```

#### Is.string

Check if the given value is string

``` javascript
console.log(Is.string('this is a string')); // true
```

#### Is.bool

Check if the given value is boolean

``` javascript
console.log(Is.bool(true)); // true
console.log(Is.bool(false)); // true
```

#### Is.function

Check if the given value is a function

``` javascript
function sum(x, y) {
    return x + y;
}

// you must pass the function name not the function call
console.log(Is.function(sum)); // true

// if you passed the function call it will be not a function in this situation
console.log(Is.function(sum(2, 3))); // false
```

#### Is.scalar

Check if the given value is a string, number or boolean

``` javascript
console.log(Is.scalar('hello')); // true
console.log(Is.scalar(22.5)); // true
console.log(Is.scalar(false)); // true
console.log(Is.scalar(null)); // false
console.log(Is.scalar(undefined)); // false
console.log(Is.scalar([])); // false
console.log(Is.scalar({})); // false
```

#### Is.empty

Check if the given value is empty

> This is a kind of smart method that will validate the given value whether it is empty or not based on its type

``` javascript

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

// arrays
value = [];                           '
console.log(Is.empty(value)); // true

value.push(12);                           '
console.log(Is.empty(value)); // false

// The `Zero` is not considered as empty value
value = 0;
console.log(Is.empty(value)); // false
```

#### Is.json

Check if the given value string is a valid json format

``` javascript
let value = '{"name":"Hasan","job":"Full Stack Developer"}';
console.log(Is.json(value)); // true
```

#### Is.url

Check if the given value is a valid url

``` javascript
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

#### Is.email

Check if the given value string is a valid email

``` javascript
let myEmail = 'hassanzohdy@gmail.com';
console.log(Is.email(myEmail)); // true
```

#### Is.cookieEnabled

Check if cookies are enabled in the browser

``` javascript
if (! Is.cookeEnabled()) {
    // Oops!, cookies are not enabled!
}
```

#### Is.mobile.*

Check if current visitor is browsing from a sort-of mobile

> this property contains set of methods

``` javascript

// To check if user is browsing from an android device
if (Is.mobile.andriod()) {
    // do something
}

// To check if  user is browsing from a blackBerry mobile
if (Is.mobile.blackBerry()) {
    // do something
}

// To check if  user is browsing from an ios device
if (Is.mobile.ios()) {
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

#### Is.desktop

Check if current visitor is browsing from a desktop device
> Please note that any non mobile type will be considered as desktop.

``` javascript
if (! Is.cookeEnabled()) {
    // Oops!, cookies are not enabled!
}
```