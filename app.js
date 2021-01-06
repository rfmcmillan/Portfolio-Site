// require express and the data.json file
const express = require("express");
// the './' below means that the data.json file is in the same folder as the current file
const data = require("./data.json").data;
const projects = data.projects;

// create an express application and assigns it to the app variable
const app = express();

// set the view engine to pug
app.set("view engine", "pug");

// sets the 'public' folder as the root directory from which to serve static assets.
app.use("/static", express.static("public"));

// set up an index route
app.get("/", (req, res) => {
  res.locals.projects = projects;
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// project routes with dynamic id parameter
// if no project exists for the given parameter, a new Error is created.
app.get("/projects/:id", (req, res, next) => {
  if (projects[req.params.id]) {
    res.locals.projectName = projects[req.params.id].project_name;
    res.locals.id = req.params.id;
    res.locals.description = projects[req.params.id].description;
    res.locals.technologies = projects[req.params.id].technologies;
    res.locals.liveLink = projects[req.params.id].live_link;
    res.locals.gitHub = projects[req.params.id].github_link;
    res.render("project");
  } else {
    const err = new Error();
    err.status = 404;
    err.message = `Looks like the project you're looking for doesn't exist.`;
    next(err);
  }
});

// 404 handler
app.use((req, res, next) => {
  console.log("404 error: The page you requested could not be found.");
  const err = new Error();
  err.status = 404;
  err.message = `Looks like the page you're looking for doesn't exist.`;
  res.locals.err = err;
  res.render("not-found");
  next(err);
});

// global handler
app.use((err, req, res, next) => {
  if (err) {
    console.log("Global error handler called", err);
  }
  if (err.status === 404) {
    res.status(404).render("not-found", { err });
  } else {
    err.message = err.message || "Looks like something went wrong";
    res.status(err.status || 500).render("error", { err });
  }
});

// start the server
app.listen(3000, () => {
  console.log("The application is running on localhost:3000!");
});
