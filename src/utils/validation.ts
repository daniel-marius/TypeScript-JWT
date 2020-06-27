/*
TypeScript Declarative Validation for Joi
*/

import * as jf from "joiful";

export class SignUp {
  @(jf
    .string()
    .required()
    .min(6)
    .max(255))
  username: string = "";

  @(jf
    .string()
    .required()
    .email()
    .min(6)
    .max(255))
  email: string = "";

  @(jf
    .string()
    .required()
    .min(6)
    .max(255))
  password: string = "";
}

export class SignIn {
  @(jf
    .string()
    .required()
    .email()
    .min(6)
    .max(255))
  email: string = "";

  @(jf
    .string()
    .required()
    .min(6)
    .max(255))
  password: string = "";
}

export class Profile {
  @(jf.string().required())
  userId: string = "";
}
