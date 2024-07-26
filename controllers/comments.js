
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const session = require('express-session');


const getAll = async (req, res) => {
  //#swagger-tags-['comments']
  try {
    const lists = await mongodb
      .getDatabase()
      .collection('comments')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger-tags-['comments']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id.');
  }
  try {
    const commentId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .collection('comments')
      .findOne({ _id: commentId });
    console.log(result);
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'comment not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  //#swagger-tags-['comments']
  const comment = {
    requestId: req.body.requestId,
    userId: req.body.userId,
    comment: req.body.comment,
    createdAt: new Date()
  };

  try {
    const response = await mongodb
      .getDatabase()
      .collection('comments')
      .insertOne(comment);
    console.log(response);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the comment.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateComment = async (req, res) => {
  //#swagger-tags-['comments']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to update a comment.');
  }
  const commentId = new ObjectId(req.params.id);

  try {
    const existingComment = await mongodb
      .getDatabase()
      .collection('comments')
      .findOne({ _id: commentId });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const updatedComment = {
      userId: req.body.userId,
      comment: req.body.comment,
      createdAt: existingComment.createdAt
    };

    const response = await mongodb
      .getDatabase()
      .collection('comments')
      .replaceOne({ _id: commentId }, updatedComment);

    // Log the response for debugging
    console.log('Update Response:', response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the comment.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteComment = async (req, res) => {
  //#swagger-tags-['comments']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid id to delete the comment.');
  }
  const commentId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .collection('comments')
      .deleteOne({ _id: commentId });
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      return res.status(404).json({ message: 'Comment not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the comment.' });
  }
};


module.exports = {
  getAll,
  getSingle,
  createComment,
  updateComment,
  deleteComment
}