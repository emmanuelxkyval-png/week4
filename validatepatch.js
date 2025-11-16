const joi = require("joi");

const validateTodoPatch = (req, res, next) => {
  const schema = joi.object({
    completed : joi.boolean().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateTodoPatch;