const checkAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied'
    });
  }
};

const checkTechnician = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'technician') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied'
    });
  }
};

const checkRequestor = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'requestor') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied'
    });
  }
};

module.exports = {
  checkAdmin,
  checkTechnician,
  checkRequestor
}