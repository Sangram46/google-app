const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// Add a task
router.post('/add', async (req, res) => {
    console.log('POST request received at /api/tasks/add');

    const { name, description, status, createdDate } = req.body;
     
    try {
        const newTask = await Task.create({ name, description, status, createdDate });
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a task
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, status, createdDate } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.name = name || task.name;
        task.description = description || task.description;
        task.status = status || task.status;
        task.createdDate = createdDate || task.createdDate;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a task
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
