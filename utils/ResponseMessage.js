const ErrorMessage = (res, status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return res.status(400).json({ success: false, error: err });
};

const SuccessMessage = (res, payload, msg) => {
  return res.status(200).json({ success: true, data: { payload, msg: msg } });
};

module.exports = { ErrorMessage, SuccessMessage };
