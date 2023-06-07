// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();
// Obtém o valor do token JWT do arquivo .env
const secret = process.env.JWT_TOKEN;
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Middleware para autenticação
const withAuth = (req, res, next) => {
  // Obtém o token do cabeçalho da requisição
  const token = req.headers["x-access-token"];
  if (!token) {
    // Retorna erro 401 se o token não foi fornecido
    res.status(401).json({ error: "Unauthorized: No token provided" });
  } else {
    // Verifica a validade do token usando o segredo
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // Retorna erro 401 se o token é inválido
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        // Decodifica o token e adiciona o email aos dados da requisição
        req.email = decoded.email;
        // Procura o usuário com base no email do token
        User.findOne({ email: decoded.email })
          .then((user) => {
            // Adiciona o objeto do usuário aos dados da requisição
            req.user = user;
            // Chama o próximo middleware
            next();
          })
          .catch((err) => {
            // Retorna erro 401 se ocorrer algum problema na busca do usuário
            res.status(401).json({ error: err });
          });
      }
    });
  }
};

module.exports = withAuth;
