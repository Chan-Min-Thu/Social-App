export const errorFun = (err: any) => {
  const error: any = new Error(err.message);
  error.status = err.status;
  error.code = err.code;
};
