import fs from "fs";

const extractExecutable = (source, destination) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destination)) {
      fs.copyFile(source, destination, (err) => {
        if (err) reject(err);
        resolve(destination);
      });
    } else {
      resolve(destination);
    }
  });
};

export { extractExecutable };
