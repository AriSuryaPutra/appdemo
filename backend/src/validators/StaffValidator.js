const Joi = require('joi');

export const create = {
  body: {
    display_name: Joi.string().required(),
    email: Joi.string().email(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

export const update = {
  body: {
    display_name: Joi.string().required(),
    email: Joi.string().email(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};
