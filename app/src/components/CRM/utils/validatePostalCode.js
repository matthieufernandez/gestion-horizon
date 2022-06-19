export const validatePostalCode = (s) => {
  return (
    /^(?=(.*\d){3})(?=(.*[a-z]){3})\w{6}$/gi.test(s) &&
    [s.charCodeAt(0), s.charCodeAt(2), s.charCodeAt(4)].every(
      (c) => c > 64 && c < 91
    ) &&
    Number(`${s.charAt(1)}${s.charAt(3)}${s.charAt(5)}`) !== NaN
  );
};
