const express = require('express');
const router = express.Router();
const passport = require('passport');
const Task = require('../models/task');
const User = require('../models/user');

// New Task
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const user = req.user._id;
    
    let newTask = new Task({
        task: req.body.task,
        user: user,
        completed: false
    });

    Task.addTask(newTask, (err, task) => {
        if(err) {
            res.json({success: false, msg: 'Failed to create task'});
        } else {
            // Update the user's task list
            User.addTask(user, task._id, (err) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to update user tasks' });
                } else {
                    res.json({ success: true, msg: 'Task created' });
                }
            });
        }
    });
});

// Complete Task
router.put('/complete/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    const taskId = req.params.id;

    Task.completeTask(taskId, (err, task) => {
        if(err) {
            res.json({success: false, msg: 'Failed to complete task'});
        } else {
            res.json({success: true, msg: 'Task completed:', task: task});
        }
    });
});

// Delete task
router.delete('/delete/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    const taskId = req.params.id;
    const user = req.user._id;

    Task.deleteTask(taskId, (err, result) => {
        if(err) {
            res.json({success: false, msg: 'Failed to delete task'});
        } else {
            // Update the user's task list
            User.deleteTask(user, taskId, (err) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to update user tasks' });
                } else {
                    res.json({ success: true, msg: 'Task deleted' });
                }
            });
        }
    });
});

// Get user's tasks
router.get('/get/:userId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const userId = req.params.userId;

    Task.findByUser(userId, (err, tasks) => {
        if(err) {
            res.json({ success: false, msg: 'Failed to get tasks'});
        } else {
            res.json({ success: true, msg: 'Retrieved tasks', tasks: tasks });
        }
    });
});

module.exports = router;