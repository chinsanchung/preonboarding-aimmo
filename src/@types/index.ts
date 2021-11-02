/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare global {
  namespace Express {
    interface Request {
      user: { _id: string };
    }
  }
}
