// make slug generator function
export const slugify = (text: string): string => {
  return text.toLowerCase().replace(/ /g, "-");
};
