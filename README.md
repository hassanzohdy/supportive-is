# Support Is
---

This is a very lightweight library to validate different things

# Install
----

**1. Download the package and extract it**
**2. Create new script tag before the end of the body and set the path for the js file**
 ``` html
    <script src="path-to-is.min.js"></script>
 ```


# Dependencies
----

> **No dependencies required to use this library**


## Usage
---
> **You can call any function in the *is* object using `is.method` or `Is.method` as `is` will be same as `Is because its declated in both names**

#### Data Types
There are many data types here to be checked

#### Is.null
Check if the given variable value is null
``` javascript
let name = null;
console.log(Is.null(name)); // true
name = undefined;
console.log(Is.null(name)); // false
```
#### Is.undefined
Check if the given variable value is undefined
``` javascript
let name = 'Hasan';
console.log(Is.undefined(name)); // false
let myVar; // any declared variable without a value will be treated as undefined
console.log(Is.undefined(myVar)); // true
```