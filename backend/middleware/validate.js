import { validationResult } from 'express-validator';

// Runs after an array of express-validator chains; returns 400 with formatted
// errors if any validation failed, otherwise calls next().
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Helper to bundle a set of validation chains with the validate middleware
// so routes can do: router.post('/', runValidation([...chains]), controller)
export const runValidation = (chains) => [...chains, validate];

export default validate;
