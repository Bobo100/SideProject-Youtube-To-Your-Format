import log from "electron-log";

export const Logs = (message, type) => {
  switch (type) {
    case "info":
      log.info(message);
      break;
    case "warn":
      log.warn(message);
      break;
    case "error":
      log.error(message);
      break;
    default:
      log.info(message);
      break;
  }
  console.log(message);
};

export const logType = {
  info: "info",
  warn: "warn",
  error: "error",
};
