const Joi = require('joi');

export const create = {
  body: {
    name: Joi.string().required(),
    deskripsi: Joi.string()
  }
};

export const update = {
  body: {
    name: Joi.string().required(),
    deskripsi: Joi.string()
  }
};
