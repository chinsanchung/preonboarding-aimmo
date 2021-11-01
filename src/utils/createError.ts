import createError from "http-errors";

export default (status: number, message: string) => {
  return createError(status, message);
};
