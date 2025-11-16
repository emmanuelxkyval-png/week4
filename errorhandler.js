

const errorhandler = (err, req, res, next) => {
  console.error(err.stac || (''));
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
};

module.exports = errorhandler;