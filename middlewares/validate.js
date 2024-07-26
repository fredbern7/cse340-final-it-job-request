const validator = require('../helpers/validate');

const validate = (rules) => {
  return (req, res, next) => {
    validator(req.body, rules, {}, (err, status) => {
      if (!status) {
        return res.status(412).send({
          success: false,
          message: 'Validation failed',
          data: err
        });
      }
      next();
    });
  };
};

const location = validate({
  locationName: 'required|string',
  extension: 'string',
});

const user = validate({
  locationId: 'required|string',
  firstName: 'required|string',
  middleName: 'string',
  lastName: 'required|string',
  email: 'required|email',
  password: 'required|string|min:8',
});

const jobOrder = validate({
  title: 'required|string',
  description: 'required|string',
  status: 'string',
  priority: 'string',
  requestedBy: 'string',
  assignedTo: 'string',
  createdAt: 'string',
  updatedAt: 'string'
});

const jobOrderUpdate = validate({
  status: 'string',
  priority: 'string',
  requestedBy: 'string',
  assignedTo: 'string',
});
const comment = validate({
    requestId: 'string|required',
    userId: 'string|required',
    comment: 'string|required',
    createdAt: 'string'
});

const dublicateEmail = 

module.exports = {
  location,
  user,
  jobOrder,
  jobOrderUpdate,
  comment
};