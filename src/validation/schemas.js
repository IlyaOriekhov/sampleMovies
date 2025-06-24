import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password",
    "any.required": "Password confirmation is required",
  }),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const movieCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must not exceed 255 characters",
    "any.required": "Title is required",
  }),

  year: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear() + 10)
    .required()
    .messages({
      "number.min": "Year must be at least 1888",
      "number.max": `Year must not exceed ${new Date().getFullYear() + 10}`,
      "any.required": "Year is required",
    }),

  format: Joi.string().valid("VHS", "DVD", "Blu-Ray").required().messages({
    "any.only": "Format must be VHS, DVD, or Blu-Ray",
    "any.required": "Format is required",
  }),

  actors: Joi.array()
    .items(
      Joi.string().trim().min(1).messages({
        "string.empty": "Actor name cannot be empty",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one actor is required",
      "any.required": "Actors are required",
    }),
});

export const movieQuerySchema = Joi.object({
  title: Joi.string().trim().optional(),
  actor: Joi.string().trim().optional(),
  sort: Joi.string().valid("title", "year").default("title"),
  order: Joi.string().valid("ASC", "DESC").default("ASC"),
});

export const movieIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.positive": "Movie ID must be a positive number",
    "any.required": "Movie ID is required",
  }),
});
