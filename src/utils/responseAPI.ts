/**
 * @desc This file contain success and error response for rest api
 */

/**
 * @desc Send any success response
 *
 * @param {string} message
 * @param {object | array} results
 * @param {number} statusCode
 */
export const successMessage = (message: string, results: object | any[], statusCode: number) => {
  return {
    message,
    code: statusCode,
    error: false,
    results
  };
};

/**
 * @desc Send any error response
 *
 * @param {string} message
 * @param {number} statusCode
 */
export const errorMessage = (message: string, statusCode: number) => {
  // List of common HTTP request code
  const codes: number[] = [200, 201, 400, 401, 403, 404, 422, 500];

  const findCode: number | undefined = codes.find((code) => code === statusCode);
  if (!findCode) {
    statusCode = 500;
  } else {
    statusCode = findCode;
  }

  return {
    message,
    code: statusCode,
    error: true
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
export const validationMessage = (errors: object | any[]) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors
  };
};
