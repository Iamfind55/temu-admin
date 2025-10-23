export const replaceSize = (w: number = 200, h: number = 200, url: string) =>
  url.includes("res.cloudinary.com")
    ? url.replace("/upload/", `/upload/w_${w},h_${h},c_fill/`)
    : url;
