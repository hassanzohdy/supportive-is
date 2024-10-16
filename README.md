# Supportive Is

A very lightweight library to validate different things

## Installation

`npm i @mongez/supportive-is`

Or using Yarn

`yarn add @mongez/supportive-is`

## Version 1

Read the previous version documentation from [here](./README-v1.md).

## Usage

In older version, all checkers are exported in teh default object `Is`, but from version 2, each method is separated in its own function, this will increase performance when tree shaking is enabled.

```ts
// Old Way
import Is from "@mongez/supportive-is";

console.log(Is.empty({})); // true

// New Way
import { isEmpty } from "@mongez/supportive-is";

console.log(isEmpty({})); // true
```

## Primitives

We've tons of primitives to be checked, here are some of them.

## Is Primitive

Check if the given value is a `string`, `number`, `boolean`, `null`, or `symbol`

```ts
import { isPrimitive } from "@mongez/supportive-is";

console.log(isPrimitive("hello")); // true
console.log(isPrimitive(22.5)); // true
console.log(isPrimitive(false)); // true
console.log(isPrimitive(null)); // true
console.log(isPrimitive(Symbol("SymbolKey"))); // true
console.log(isPrimitive([])); // false
console.log(isPrimitive({})); // false
```

## Is Scalar

Check if the given value is a `string`, `number`, `bigInt` or `boolean`

```ts
import { isScalar } from "@mongez/supportive-is";

console.log(isScalar("hello")); // true
console.log(isScalar(22.5)); // true
console.log(isScalar(false)); // true
console.log(isScalar(null)); // false
console.log(isScalar(undefined)); // false
console.log(isScalar([])); // false
console.log(isScalar({})); // false
```

## Is Json

Check if the given value string is a valid json format

```ts
import { isJson } from "@mongez/supportive-is";

let value = '{"name":"Hasan","job":"Software Engineer"}';

console.log(isJson(value)); // true
```

## Is String

Check if the given value is a string

```ts
import { isString } from "@mongez/supportive-is";

let myString = "hello world";

console.log(isString(myString)); // true
```

## Is numeric

Check if the given value is a number whether if its data type is `String` or `Number`

```ts
import { isNumeric } from "@mongez/supportive-is";

let numberInt = 12;
console.log(isNumeric(numberInt)); // true

let numberFloat = 12.55;
console.log(isNumeric(numberFloat)); // true

let numberWrittenInString = "99";
console.log(isNumeric(numberWrittenInString)); // true

let floatWrittenInString = "99.99";
console.log(isNumeric(floatWrittenInString)); // true
```

## Is.int

Check if the given value is an integer and its data type is number

```ts
import { isInt } from "@mongez/supportive-is";

let number = 12;
console.log(isInt(numberInt)); // true

let numberInString = "12";
console.log(isInt(numberInString)); // false
```

## Is float

Check if the given value is a float number and its data type is number

```ts
import { isFloat } from "@mongez/supportive-is";

let number = 921;
console.log(isFloat(number)); // true

number = 82.42;
console.log(isFloat(number)); // true

let numberInString = "12";
console.log(isFloat(numberInString)); // false

let floatInString = "12.5";

console.log(isFloat(floatInString)); // false
```

## Is Regex

Check if the given value is a regular expression

```ts
import { isRegex } from "@mongez/supportive-is";

let regex = /hello/;

console.log(isRegex(regex)); // true

let regexString = "/hello/";

console.log(isRegex(regexString)); // false

let regexObject = new RegExp("hello");

console.log(isRegex(regexObject)); // true
```

## Is Object

Check if the given value is an object

Any type of objects will be validated as true no matter its object type

> Arrays are types of objects so any passed array will be validated as true
> null values are considered objects in javascript, but it will be validated as false if provided.

```ts
import { isObject } from "@mongez/supportive-is";

let myObject = {};
console.log(isObject(myObject)); // true

class myClass {}
let anotherObject = new myClass();
console.log(isObject(myObject)); // true

let myArray = [];
console.log(isObject(myArray)); // true

console.log(isObject(null)); // false

// to check if the given value is an object but not an array
//you must mix between isObject AND Is.array to avoid an array
if (isObject(myVar) && !Is.array(myVar)) {
  // do something with that object
}
```

## Is Array

Check if the given value is an array

```ts
import { isArray } from "@mongez/supportive-is";

let myArray = [];

console.log(isArray(myArray)); // true
```

> This is just an alias to `Array.isArray` method

## Is PlainObject

Check if the given value is a plain javascript object

```ts
import { isPlainObject } from "@mongez/supportive-is";

// plain objects
let myObject = {};
console.log(isPlainObject(myObject)); // true

// classes
class myClass {}
let anotherObject = new myClass();

console.log(isPlainObject(myObject)); // false

// arrays
let myArray = [];

console.log(isPlainObject(myArray)); // false

// null value
console.log(isPlainObject(null)); // false
```

## Is iterable

Check if the given value is iterable

```ts
import { isIterable } from "@mongez/supportive-is";

let myArray = [1, 2, 3];

console.log(isIterable(myArray)); // true

let myObject = { a: 1, b: 2, c: 3 };

console.log(isIterable(myObject)); // true

let myString = "hello";

console.log(isIterable(myString)); // true

let myNumber = 123;

console.log(isIterable(myNumber)); // false

let myBoolean = true;

console.log(isIterable(myBoolean)); // false

let myFunction = function () {};

console.log(isIterable(myFunction)); // false

let myNull = null;

console.log(isIterable(myNull)); // false

let myUndefined = undefined;

console.log(isIterable(myUndefined)); // false
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

## Is empty

Check if the given value is empty.

> This is a kind of smart method that will validate the given value whether it is empty or not based on its type

```ts
import { isEmpty } from "@mongez/supportive-is";

// undefined values are considered empty
let value = undefined;
console.log(isEmpty(value)); // true

// null values are considered empty
value = null;
console.log(isEmpty(value)); // true

// Also any objects with no values are considered empty
value = {};
console.log(isEmpty(value)); // true

value.name = "Hasan";
console.log(isEmpty(value)); // false

// Arrays
value = [];
console.log(isEmpty(value)); // true

value.push(12);
console.log(isEmpty(value)); // false

// The `Zero` is not considered as empty value
value = 0;
console.log(isEmpty(value)); // false
```

## Is.generator

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

## Is.url

Check if the given value is a valid url

```ts
import { isUrl } from "@mongez/supportive-is";

let url = "google.com";
console.log(isUrl(url)); // true

url = "https://google.com";
console.log(isUrl(url)); // true

url = "www.google.com";
console.log(isUrl(url)); // true
url = "www.google.com:8080";
console.log(isUrl(url)); // true

url = "www.google.com?q=hello+world";
console.log(isUrl(url)); // true

let url = "google";
console.log(isUrl(url)); // false
```

## Is email

Check if the given value string is a valid email

```ts
import { isEmail } from "@mongez/supportive-is";

let myEmail = "hassanzohdy@gmail.com";
console.log(isEmail(myEmail)); // true
```

## Is date

Check if the given value is a date

```ts
import { isDate } from "@mongez/supportive-is";

let myDate = new Date();

console.log(isDate(myDate)); // true
```

## Is promise

Check if the given value is a promise

```ts
import { isPromise } from "@mongez/supportive-is";

let myPromise = new Promise((resolve, reject) => {
  resolve("hello world");
});

console.log(isPromise(myPromise)); // true
```

## Is form element

Check if the given value is a form element

```ts
import { isFormElement } from "@mongez/supportive-is";

let myForm = document.querySelector("form");

console.log(isFormElement(myForm)); // true
```

> Is.formElement is an alias for Is.form

## Is formData

Check if the given value is a form data

```ts
import { isFormData } from "@mongez/supportive-is";

let myFormData = new FormData();

console.log(isFormData(myFormData)); // true
```

## Is browser

Check if current browser matches the given name

```ts
import { isBrowser } from "@mongez/supportive-is";

console.log(isBrowser("chrome"));
console.log(isBrowser("firefox"));
console.log(isBrowser("safari"));
console.log(isBrowser("opera"));
console.log(isBrowser("edge"));
console.log(isBrowser("ie"));
```

## Is validHtmlId

Check if the given value is a valid html id

```ts
import { isValidHtmlId } from "@mongez/supportive-is";

let id = "myId";

console.log(isValidHtml(id)); // true

id = "myId-1";

console.log(isValidHtml(id)); // true

id = "myId-1-1";

console.log(isValidHtml(id)); // true

id = "myId-1-";

console.log(isValidHtml(id)); // false
```

## Is mobile

Check if current visitor is browsing from a sort-of mobile

> this property contains set of methods

```ts
import { isMobile } from "@mongez/supportive-is";
// To check if user is browsing from an android device
if (isMobile.android()) {
  // do something
}

// To check if  user is browsing from an ios device
if (isMobile.ios()) {
  // do something
}

// To check if  user is browsing from an iphone
if (isMobile.iphone()) {
  // do something
}

// To check if  user is browsing from an ipad
if (isMobile.ipad()) {
  // do something
}

// To check if  user is browsing from an ipod
if (isMobile.ipod()) {
  // do something
}

// To check if  user is browsing from a windows mobile
if (isMobile.windows()) {
  // do something
}

// To check if user is browsing from any type of mobile
if (isMobile.any()) {
  // do something
}
```

## Is desktop

Check if current visitor is browsing from a desktop device

> Please note that any non mobile type will be considered as desktop.

```ts
import { isDesktop } from "@mongez/supportive-is";

if (!isDesktop()) {
  // do something
}
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

- V2.0.0 (04 Sept 2023)
  - Separated each method in its own function
  - Removed many unused methods to reduce the package size
- V1.0.7 (11 Oct 2022)
  - Added tests
  - Enhanced Documentation
  - Added more methods
