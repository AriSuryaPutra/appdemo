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

export const add_permission = {
  body: {
    permission_uuid: Joi.array().required()
  }
};
