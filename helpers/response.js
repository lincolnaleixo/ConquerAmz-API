const sendResponse = ({
  res,
  statusCode = 200,
  message = 'success',
  responseBody
}) => {
  res.status(statusCode).send({
    data: responseBody,
    status: false,
    message,
  });
};

const sendErrorResponse = ({
  res,
  statusCode = 500,
  message = 'error',
  responseBody,
}) => {
  res.status(statusCode).send({
    data: responseBody,
    status: false,
    message,
  });
};

export default {
  sendResponse,
  sendErrorResponse,
};
