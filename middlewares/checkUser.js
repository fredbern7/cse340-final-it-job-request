const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userId = req.params.id ? new ObjectId(req.params.id) : null;

    const user = await mongodb
      .getDatabase()
      .collection('users')
      .findOne({ email: email });

    if (user && (!userId || user._id.toString() !== userId.toString())) {
      return res.status(400).json({ message: 'Email already been used' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCheckLocation = async (req, res, next) => {
  try {
    const locationId = req.body.locationId; // Adjust to match the actual structure of your request body

    if (!ObjectId.isValid(locationId)) {
      console.log('Invalid location ID.');
      return res.status(400).json({ message: 'Invalid location ID.' });
    }

    console.log(`Received LocationId: ${locationId}`);

    const location = await mongodb
      .getDatabase()
      .collection('locations')
      .findOne({ _id: new ObjectId(locationId) });

    if (!location) {
      console.log('Unable to create user due to missing location.');
      return res.status(400).json({
        message: 'Unable to create user due to missing location.'
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while checking the location ID' });
  }
};

const updateCheckLocation = async (req, res, next) => {
    try {
      const locationId = req.body.locationId;
  
      if (!ObjectId.isValid(locationId)) {
        console.log('Invalid location ID.');
        return res.status(400).json({ message: 'Invalid location ID.' });
      }
  
      console.log(`Received LocationId: ${locationId}`);
  
      const database = mongodb.getDatabase();
  
      const location = await database
        .collection('locations')
        .findOne({ _id: new ObjectId(locationId) });
  
      if (!location) {
        console.log('Unable to update user due to missing location.');
        return res.status(400).json({
          message: 'Unable to update user due to missing location.'
        });
      } else {
        next();
      }
    } catch (err) {
      console.error('Error during location check:', err);
      res.status(500).json({ message: 'Server error while checking the location ID' });
    }
  };

const deleteCheck = async (req, res, next) => {
try {
  const userId = req.params.id;

  console.log(`Received userId: ${userId}`);

  const inrequests = await mongodb
    .getDatabase()
    .collection('requests')
    .findOne({ requestedBy: userId });
  const incomments = await mongodb
    .getDatabase()
    .collection('comments')
    .findOne({ userId: userId });

  if (inrequests || incomments) {
    console.log('User cannot be deleted, please clear all requests and comments created by this user.');
    return res.status(400).json({
      message: 'User cannot be deleted, please clear all requests and comments created by this user.'
    });
  }

  next();
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server error while checking the user' });
}
};

module.exports = {
  checkDuplicateEmail,
  createCheckLocation,
  updateCheckLocation,
  deleteCheck
};
