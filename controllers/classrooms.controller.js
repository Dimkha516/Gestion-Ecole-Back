const ClassroomModel = require("../models/classroom.model");

module.exports.createClassroom = async (req, res) => {
  // create new classroom here
  try {
    const { name, capacity, location } = req.body;
    const newClassroom = await ClassroomModel.create({
      name,
      capacity,
      location,
    });
    res.status(200).json({ classroom: newClassroom });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// get all classrooms

module.exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await ClassroomModel.find();
    res.status(200).json({ classrooms });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
