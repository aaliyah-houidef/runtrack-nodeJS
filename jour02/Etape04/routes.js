//promesses avec le module fs
const fs = require("fs").promises;
const url = require("url");
const path = require("path");

// Chemin vers le fichier data.json
const dataFilePath = path.join(__dirname, "data.json");

// lire les tâches depuis data.json
const readTasks = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data).tasks;
  } catch (err) {
    console.error("Error reading tasks:", err);
    return [];
  }
};

//écrire les tâches dans data.json
const writeTasks = async (tasks) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify({ tasks }, null, 2));
  } catch (err) {
    console.error("Error writing tasks:", err);
  }
};

//générer un nouvel ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

//récupérer toutes les tâches
const getAllTasks = async (req, res) => {
  const tasks = await readTasks();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(tasks));
};

//créer une nouvelle tâche
const createTask = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const tasks = await readTasks();
    const newTask = JSON.parse(body);
    newTask.id = generateId(); // Générer un nouvel ID
    tasks.push(newTask);
    await writeTasks(tasks);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newTask));
  });
};

//mettre à jour une tâche existante
const updateTask = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const tasks = await readTasks();
    const updatedTask = JSON.parse(body);
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      await writeTasks(tasks);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tasks[index]));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Task not found" }));
    }
  });
};

//supprimer une tâche existante
const deleteTask = async (req, res, id) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    await writeTasks(tasks);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task deleted" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task not found" }));
  }
};

// Routeur principal
const routes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  if (path === "/tasks" && method === "GET") {
    getAllTasks(req, res);
  } else if (path === "/tasks" && method === "POST") {
    createTask(req, res);
  } else if (path.startsWith("/tasks/") && method === "PUT") {
    const id = path.split("/")[2];
    updateTask(req, res, id);
  } else if (path.startsWith("/tasks/") && method === "DELETE") {
    const id = path.split("/")[2];
    deleteTask(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

module.exports = {
  routes,
  readTasks,
  writeTasks,
  generateId,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
