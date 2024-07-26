const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const session = require('express-session');

const getAll = async (req, res) => {
  //#swagger-tags-['Job requests']
  try {
    const lists = await mongodb
      .getDatabase()
      .collection('requests')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger-tags-['Job requests']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id.');
  }
  try {
    const jobrequestId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('requests')
      .findOne({ _id: jobrequestId });
    console.log(result);
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Job Request not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createRequest = async (req, res) => {
  //#swagger-tags-['Job requests']
  const jobrequest = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    requestedBy: req.body.requestedBy,
    assignedTo: req.body.assignedTo,
    createdAt: new Date(),
    updatedAt: "",
  };

  try {
    const response = await mongodb
      .getDatabase()
      .collection('requests')
      .insertOne(jobrequest);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the job request.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateRequest = async (req, res) => {
  //#swagger-tags-['Job requests']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to update a job request.');
  }
  const jobrequestId = new ObjectId(req.params.id);

  try {
    const existingJobRequest = await mongodb
      .getDatabase()
      .collection('requests')
      .findOne({ _id: jobrequestId });

    if (!existingJobRequest) {
      return res.status(404).json({ message: 'Job Request not found' });
    }

    const updatedJobRequest = {
      title: existingJobRequest.title,
      description: existingJobRequest.description,
      status: req.body.status || existingJobRequest.status,
      priority: req.body.priority || existingJobRequest.priority,
      requestedBy: req.body.requestedBy || existingJobRequest.requestedBy,
      assignedTo: req.body.assignedTo || existingJobRequest.assignedTo,
      createdAt: existingJobRequest.createdAt,
      updatedAt: new Date()
    };

    console.log('Updated Job Request:', updatedJobRequest);

    const response = await mongodb
      .getDatabase()
      .collection('requests')
      .replaceOne({ _id: jobrequestId }, updatedJobRequest);

    console.log('Update Response:', response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the job request.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteRequest = async (req, res) => {
  //#swagger-tags-['Job requests']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to delete a job request.');
  }

  const jobrequestId = new ObjectId(req.params.id);
  try {
    const jobrequestIdString = jobrequestId.toString();

    const requestDeleteRespone = await mongodb
      .getDatabase()
      .collection('requests')
      .deleteOne({ _id: jobrequestId });
      console.log('Request Delete Response:', requestDeleteRespone);

    if (jobrequestIdString) {
      const deleteCommentsResponse = await mongodb
        .getDatabase()
        .collection('comments')
        .deleteMany({ requestId: jobrequestIdString });

      console.log('Comments Delete Response:', deleteCommentsResponse);
      res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Job Request not found.' });
    }
  } catch (err) {
    console.error('Error while deleting job request and comments:', err);
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the job request.' });
  }
};

module.exports = deleteRequest;


module.exports = {
  getAll,
  getSingle,
  createRequest,
  updateRequest,
  deleteRequest
}