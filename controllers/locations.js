
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const session = require('express-session');


const getAll = async (req, res) => {
  //#swagger-tags-['Locations']
  try {
    const lists = await mongodb
      .getDatabase()
      .collection('locations')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger-tags-['Locations']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id.');
  }
  try {
    const locaitonId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('locations')
      .findOne({ _id: locaitonId });
    console.log(result);
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createLocation = async (req, res) => {
  //#swagger-tags-['Locations']
  const location = {
    locationName: req.body.locationName,
    extension: req.body.extension,
  };

  console.log(location);
  try {
    const response = await mongodb
      .getDatabase()
      .collection('locations')
      .insertOne(location);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the location.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateLocation = async (req, res) => {
  //#swagger-tags-['Locations']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to update a location.');
  }
  const locationId = new ObjectId(req.params.id);
  const location = {
    locationName: req.body.locationName,
    extension: req.body.extension,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .collection('locations')
      .replaceOne({ _id: locationId }, location);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the location.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Corrected syntax here
  }
};

const deleteLocation = async (req, res) => {
  //#swagger-tags-['Users']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to delete a location.');
  }
  const locationId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .collection('locations')
      .deleteOne({ _id: locationId });
    console.log(response);
    if (response.deletedCount > 0) {
      console.log(`Location was deleted sucessfully`);
      res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Location not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the location.' });
  }
};



module.exports = {
  getAll,
  getSingle,
  createLocation,
  updateLocation,
  deleteLocation
}