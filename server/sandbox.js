// const validatePostalCode = (s) => {
//   return (
//     /^(?=(.*\d){3})(?=(.*[a-z]){3})\w{6}$/gi.test(s) &&
//     Number(`${s.charAt(0)}${s.charAt(2)}${s.charAt(4)}`) === NaN
//   );
// };

// const test = (s) => {
//   return Number(`${s.charAt(0)}${s.charAt(2)}${s.charAt(4)}`) === NaN;
// };

// const test2 = (s) => {
//   return Number(`${s.charAt(0)}${s.charAt(2)}${s.charAt(4)}`);
// };

// console.log(Number("a"));

// console.log(Number(`word`));

// console.log(test("a1a1a1"));
// console.log(test2("a1a1a1"));
// console.log(validatePostalCode("hhh222"));

// console.log(typeof NaN);
// ^ LOGS "NUMBER" T_T

// console.log(Number`string` === NaN);
// console.log(typeof Number`string`);
// console.log(Number`string`);

// console.log(validatePostalCode("h2a2h2"));

// const checkResult = (s) => {
//   return s.split(" ").join("");
// };

// console.log(checkResult("h2h 2h2"));

// const getTimeFromUnix = (u) => {
//   return `${new Date(u)}`.split(" ")[4].split(":").slice(0, 2).join(":");
// };
// console.log(getTimeFromUnix(1638979872155));

// const checkType = (v) => {
//   return typeof v === NaN;
// };

// const convertType = (v) => {
//   return Number(v);
// };

// console.log(checkType(Number("a")));
// console.log(convertType("a"));

// testing numbers toUpperCase

// const test = (s) => {
//   return s.toUpperCase();
// };

// const checkLength = (s) => s.length;

// console.log(checkLength("frigidaire"));

// console.log(test("a1b2c3"));

// testing isNan

// const test = (arg) => {
//   return isNaN(arg);
// };

// console.log(test(123));
