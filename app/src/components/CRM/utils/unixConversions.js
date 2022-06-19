export const getTimeFromUnix = (u) => {
  return `${new Date(u * 1000)}`.split(" ")[4].split(":").slice(0, 2).join(":");
};

export const getDateFromUnix = (u) => {
  return new Date(u * 1000).toLocaleDateString().replaceAll("/", "-");
};
