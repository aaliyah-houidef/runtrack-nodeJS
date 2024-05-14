const fs = require("fs");
const url = require("url");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

const readTasks = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
};

const getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(tasks));
};

const createTask = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const tasks = readTasks();
    const newTask = JSON.parse(body);
    tasks.push(newTask);
    writeTasks(tasks);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newTask));
  });
};

const updateTask = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const tasks = readTasks();
    const updatedTask = JSON.parse(body);
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      writeTasks(tasks);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tasks[index]));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Task not found" }));
    }
  });
};

const deleteTask = (req, res, id) => {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    writeTasks(tasks);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task deleted" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Task not found" }));
  }
};

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

module.exports = routes;
