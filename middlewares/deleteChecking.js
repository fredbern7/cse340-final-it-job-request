const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const deleteCheckLocation = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    console.log(`Received locationId: ${requestId}`);

    const result = await mongodb
      .getDatabase()
      .collection('users')
      .findOne({ _Id: requestId });

    // console.log(`Query result: ${JSON.stringify(result)}`);

    if (result) {
      console.log('Location is in use by a user');
      return res.status(400).json({
        message: 'Location is in use by a user'
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error while checking location usage'
    });
  }
};

const checkRequestIfExisted = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    console.log(`Received Job Request: ${requestId}`);

    const result = await mongodb
      .getDatabase()
      .collection('requests')
      .findOne({ jobrequestId: requestId });

    console.log(`Query result: ${JSON.stringify(result)}`);

    if (result) {
      console.log('Location is in use by a user');
      return res.status(400).json({
        message: 'Location is in use by a user'
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error while checking location usage'
    });
  }
};


module.exports = {
  deleteCheckLocation,
  checkRequestIfExisted
};
