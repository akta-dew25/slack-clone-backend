export const parseFormData = (req, res, next) => {
  try {
    if (req.body.org) {
      req.body.org = JSON.parse(req.body.org);
    }

    if (req.body.user) {
      req.body.user = JSON.parse(req.body.user);
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid request payload",
      errors: [error.message],
    });
  }
};
