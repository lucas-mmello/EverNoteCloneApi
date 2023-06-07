const Note = require("../models/note");

// Função auxiliar para verificar se o usuário é o autor da nota
const isOwner = (user, note) => {
  if (JSON.stringify(user._id) == JSON.stringify(note.author._id)) return true;
  else return false;
};

module.exports = {
  // Método para listar todas as notas do usuário logado
  listarTodas: async (req, res) => {
    try {
      let notes = await Note.find({ author: req.user._id });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Problem to get notes" });
    }
  },
  // Método para selecionar uma nota específica
  selecionar: async (req, res) => {
    try {
      const { id } = req.params;
      let note = await Note.findById(id);
      if (isOwner(req.user, note)) {
        res.json(note);
      } else {
        res.status(403).json({ error: "Permission denied" });
      }
    } catch (error) {
      res.status(500).json({ error: "Problem to get a new note" });
    }
  },
  // Método para criar uma nova nota
  criar: async (req, res) => {
    const { title, body } = req.body;

    try {
      let note = new Note({ title: title, body: body, author: req.user._id });
      await note.save();
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: "Problem to create a new note" });
    }
  },
  // Método para alterar uma nota existente
  alterar: async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;

    try {
      let note = await Note.findById(id);
      if (isOwner(req.user, note)) {
        let note = await Note.findOneAndUpdate(
          { _id: id },
          { $set: { title: title, body: body } },
          { upsert: true, new: true }
        );
        res.json(note);
      } else {
        res.status(403).json({ error: "Permission denied" });
      }
    } catch (error) {
      res.status(500).json({ error: "Problem to update a new note" });
    }
  },
  // Método para excluir uma nota
  excluir: async (req, res) => {
    const { id } = req.params;
    try {
      let note = await Note.findById(id);
      if (isOwner(req.user, note)) {
        await note.deleteOne();
        res.json({ message: "Ok" }).status(204);
      } else {
        res.status(403).json({ error: "Permission denied" });
      }
    } catch (error) {
      res.status(500).json({ error: "Problem to delete a new note" });
    }
  },
  // Método para buscar notas por um termo de pesquisa
  buscar: async (req, res) => {
    const { query } = req.query;
    try {
      let notes = await Note.find({ author: req.user._id }).find({
        $text: { $search: query },
      });
      res.json(notes).status(200);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
