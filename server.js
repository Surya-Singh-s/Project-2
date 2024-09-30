const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cse-team', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Project Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Project = mongoose.model('Project', projectSchema);

// Routes

// Create Project
app.post('/projects', async (req, res) => {
    const { title, description } = req.body;
    const project = new Project({ title, description });
    await project.save();
    res.status(201).send(project);
});

// Get All Projects
app.get('/projects', async (req, res) => {
    const projects = await Project.find();
    res.send(projects);
});

// Update Project
app.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const project = await Project.findByIdAndUpdate(id, { title, description }, { new: true });
    res.send(project);
});

// Delete Project
app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
