export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export const removeGmailSuffix = (email: string) => {
  if (email.endsWith("@gmail.com")) {
    return email.slice(0, -10);
  }
  return email;
};
