const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const checkDuplicateLocation = async (req, res, next) => {
  try {
    const { locationName } = req.body;
    const locaitonId = req.params.id ? new ObjectId(req.params.id) : null;

    const location = await mongodb
      .getDatabase()
      .collection('locations')
      .findOne({ locationName: locationName });

    if (location && (!locaitonId || location._id.toString() !== locaitonId.toString())) {
      return res.status(400).json({ message: 'Location is already existed.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCheck = async (req, res, next) => {
  try {
    const locationId = req.params.id;

    console.log(`Received LocationId: ${locationId}`);

    const location = await mongodb
      .getDatabase()
      .collection('users')
      .findOne({ locationId: locationId });

    if (location) {
      console.log('Unable to delete the location. it is used by some users.');
      return res.status(400).json({
        message: 'Unable to delete the location. it is used by some users.'
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while checking the location ID' });
  }
};

module.exports = {
  checkDuplicateLocation,
  deleteCheck
};