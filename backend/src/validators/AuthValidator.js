const Joi = require('joi');

export const changePassword = {
  body: {
    old_password: Joi.string().required(),
    new_password: Joi.string().required()
  }
};

export const register = {
  body: {
    display_name: Joi.string().required(),
    email: Joi.string().email(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

export const login = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

export const refresh = {};

export const logout = {};
