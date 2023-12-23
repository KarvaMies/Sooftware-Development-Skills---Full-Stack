const mongoose = require('mongoose');

// Task Schema
const TaskSchema = mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    completed: {
        type: Boolean
    }
});

const Task = module.exports = mongoose.model('Task', TaskSchema);

module.exports.getTaskById = function(id, callback){
    Task.findById(id, callback);
}

module.exports.addTask = function(newTask, callback){
    newTask.save(callback);
}

module.exports.completeTask = function(id, callback){
    Task.findByIdAndUpdate(id, { completed: true }, { new: true}, callback);
}

module.exports.deleteTask = function(id, callback){
    Task.findByIdAndDelete(id, callback);
}

module.exports.findByUser = function(userId, callback) {
    Task.find({ user: userId }, callback);
}