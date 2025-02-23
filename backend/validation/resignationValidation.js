const Joi = require('joi');

exports.resignationValidation = (data) => {
  const schema = Joi.object({
    lwd: Joi.date().required()
  });
  return schema.validate(data);
};

exports.exitResponseValidation = (data) => {
  const schema = Joi.object({
    responses: Joi.array().items(
      Joi.object({
        questionText: Joi.string().required(),
        response: Joi.string().required()
      })
    ).required()
  });
  return schema.validate(data);
};
