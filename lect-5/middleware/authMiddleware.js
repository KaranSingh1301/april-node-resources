const isAuth = (req, res, next) => {
  if (req.session.isAuth === true) {
    next();
  } else {
    return res.send("Invalid Session from Auth middleware");
  }
};

module.exports = isAuth;
