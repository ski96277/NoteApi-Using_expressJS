const express = require("express");
const auth = require("../middlewares/auth");
const {
  getNotes,
  deleteNote,
  createNote,
  updateNote,
  getANote,
} = require("../controllers/noteController");

const notesRoutes = express.Router();

notesRoutes.get("/",auth, getNotes);
notesRoutes.post("/", auth, createNote);
notesRoutes.put("/:id",auth,  updateNote);
notesRoutes.delete("/:id", auth,  deleteNote);
notesRoutes.get("/:id", auth, getANote);

module.exports = notesRoutes;
