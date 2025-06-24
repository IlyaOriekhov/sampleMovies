import createHttpError from "http-errors";

export const badRequest = (message, details = null) => {
  return createHttpError(400, message, {
    status: 0,
    ...(details && { details }),
  });
};

export const unauthorized = (message = "Unauthorized") => {
  return createHttpError(401, message, { status: 0 });
};

export const forbidden = (message = "Forbidden") => {
  return createHttpError(403, message, { status: 0 });
};

export const notFound = (message = "Not found") => {
  return createHttpError(404, message, { status: 0 });
};

export const conflict = (message = "Conflict") => {
  return createHttpError(409, message, { status: 0 });
};

export const validationError = (details) => {
  return badRequest("Validation failed", details);
};
