const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.send({
      status: 400,
      message: "Invalid Session, please login again",
    });
  }
};

module.exports = { isAuth };
