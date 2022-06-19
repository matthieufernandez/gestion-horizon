export const addComma = (num) => {
  // handle wrong data types
  if (typeof num !== "number") return NaN;

  // return string version of number with comma, n > 0
  if (num >= 0)
    return `${num
      .toString()
      .split(".")[0]
      .split("")
      .reverse()
      .map((n, index) =>
        (index + 1) % 3 === 0 &&
        index + 1 !== num.toString().split(".")[0].length
          ? `,${n}`
          : n
      )
      .reverse()
      .join("")}${
      num.toString().split(".")[1] ? `.${num.toString().split(".")[1]}` : ""
    }`;

  if (num < 0)
    return `-${num
      .toString()
      .replace("-", "")
      .split(".")[0]
      .split("")
      .reverse()
      .map((n, index) =>
        (index + 1) % 3 === 0 &&
        index + 1 !== num.toString().split(".")[0].length - 1
          ? `,${n}`
          : n
      )
      .reverse()
      .join("")}${
      num.toString().split(".")[1] ? `.${num.toString().split(".")[1]}` : ""
    }`;
};
