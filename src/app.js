const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ Error: "Invalid repository ID" });
  }
  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ Error: "Repository not found" });
  }

  const countLikes =
    repositories[repositoryIndex].likes > 0
      ? repositories[repositoryIndex].likes
      : 0;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: countLikes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ Error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ Error: "Repository not found" });
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
