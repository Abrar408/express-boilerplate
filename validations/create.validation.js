const Joi = require("joi");

const bookCreateSchema = Joi.object({
  query: Joi.object({}).length(0),
  params: Joi.object({}).length(0),
  body: Joi.object({
    category: Joi.string().required(),
    genreId: Joi.number().required(),
    title: Joi.string().max(60).required(),
    synopsis: Joi.string().max(250).required(),
    contentRating: Joi.number().required(),
    novelType: Joi.string().required(),
    canonSource: Joi.string().max(60).optional(),
    tags: Joi.string().max(170).required(),
    contestId: Joi.number().optional(),
    coverPage: Joi.string().optional(),
  }),
});

module.exports = bookCreateSchema;
