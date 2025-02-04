const noteModel = require("../models/note");

const createNote = async (req, res) => {
  console.log("user id = " + req.userId);
  try {
    const { title, description } = req.body;

    const newNote = new noteModel({
      title: title,
      description: description,
      userId: req.userId,
    });
    const result = await newNote.save();
    return res.status(201).json({ message: "Created New note", note: result });
  } catch (error) {
    console.log("Failed to created a note" + error);
    return res.status(500).json({ message: "Failed to create new Notes" });
  }
};

const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    const note = await noteModel.findByIdAndDelete(noteId);
    if (note) {
      return res.status(200).json({ message: "Deleted note", note: note });
    } else {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    console.log("Failed to delete note = " + error);
    return res.status(200).json({ message: "Failed to delete the Note" });
  }
};

const updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, description } = req.body;
  const newNote = {
    title: title,
    description: description,
    userId: req.userId,
  };

  try {
    const result = await noteModel.findByIdAndUpdate(noteId, newNote, {
      new: true,
    });
    if(result){
        return res.status(200).json({ message: "Updated", note: result });
    }else{
        return res.status(404).json({ message: "Updated not found", });
    }
    
  } catch (error) {
    console.log("Put notes update got an error" + error);
    return res.status(500).json({ message: "Failed to Update the notes" });
  }
};

const getNotes = async (req, res) => {
  try {
    let { limit, page } = req.query;
    //parse limit & default values 10 
    limit = parseInt(limit) || 10;
    //parse page & default values 1
    page = parseInt(page)|| 1;

    const skip = (page - 1) * limit;


    console.log("params data  = " + limit + " " + page + " " + skip);

    const notes = await noteModel.find({ userId: req.userId }).skip(skip).limit(limit);
    //get total notes
    const totalNotes = await noteModel.countDocuments({ userId: req.userId });

    return res.status(200).json({notes, 
      totalPages: (Math.ceil(totalNotes / limit)),
      limit: limit,
      page: page
    });
  } catch (error) {
    console.log("Get all notes got an error" + error);
    return res.status(500).json({ message: "Failed to fetch all notes" });
  }
};

const getANote = async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await noteModel.findById(noteId);
    if (note) {
      return res.status(200).json({ message: "Found", note: note });
    } else {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    console.log("Get a note got an error" + error);
    return res.status(500).json({ message: "Failed to fetch the note" });
  }
};

module.exports = { createNote, deleteNote, updateNote, getNotes,getANote };
