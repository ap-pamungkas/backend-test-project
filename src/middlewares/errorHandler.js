

export function errorHandler(err, req, res, next) {
  if (err.name === 'ZodError')
    return res.status(400).json({ message: 'Validation error', details: err.errors });
  
  res.status(500).json({ message: 'Internal server error' });
}