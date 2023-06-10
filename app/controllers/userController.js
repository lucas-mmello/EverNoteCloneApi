const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_TOKEN;

module.exports = {
  // Método para registrar um novo usuário
  registrar: async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    try {
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error registering new user please try again." });
    }
  },
  // Método para fazer login do usuário
  logar: async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.find({ email });
      if (!user) {
        res.status(401).json({ error: "Incorrect email or password" });
      } else {
        user.isCorrectPassword(password, function (err, same) {
          if (!same) {
            res.status(401).json({ error: "Incorrect email or password" });
          } else {
            const token = jwt.sign({ email }, secret, { expiresIn: "1d" });
            res.json({ user: user, token: token });
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal error please try again" });
    }
  },

  atualizar: async function (req, res) {
    const { name, email } = req.body;

    try {
      let user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { name: name, email: email } },
        { upsert: true, new: true }
      );
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error });
    }
  },

  senhaNova: async function (req, res) {
    const { password } = req.body;

    try {
      let user = await User.find({ _id: req.user._id });
      user.password = password;
      user.save();
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error });
    }
  },

  excluir: async function (req, res) {
    try {
      let user = await User.find({ _id: req.user._id });
      await user.delete();
      res.json({ message: "OK" }).status(201);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
