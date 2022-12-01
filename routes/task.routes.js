import express from "express";
import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";

const taskRoute = express.Router();

// POST create task
taskRoute.post("/create-task/:idUser", async (req,res)=>{
    try {
        const {idUser} = req.params;
        const newTask = await taskModel.create({...req.body, user: idUser});
        // update user to add a task
        await userModel.findByIdAndUpdate(idUser, {$push: {tasks: newTask._id}}, {new: true, runValidators: true});        
        return res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
    }
});

// GET one-task
taskRoute.get("/oneTask/:idTask", async (req,res)=>{
    try {
        const {idTask} = req.params;
        const oneTask = await taskModel.findById(idTask).populate("user");
        return res.status(200).json(oneTask);
    } catch (error) {
        console.log(error);
    }
})

// GET all-tasks
taskRoute.get("/all-tasks", async (req,res)=>{
    try {
        const allTasks = await taskModel.find().populate("user");
        return res.status(200).json(allTasks);
    } catch (error) {
        console.log(error);
    }
})

//update
taskRoute.put("/edit/:idTask", async (req,res)=>{
    try {
        const {idTask} = req.params;
        const updatedTask = await taskModel.findOneAndUpdate({_id: idTask}, {...req.body}, {new: true, runValidators:true});
        return res.status(200).json(updatedTask);
    } catch (error) {
        console.log(error);
    }    
})

//delete
taskRoute.delete("/delete/:idTask", async (req,res)=>{
    try {
        const {idTask} = req.params;
        const deletedTask = await taskModel.findByIdAndDelete(idTask);
        
        //delete task id from user
        await userModel.findByIdAndUpdate(deletedTask.user, {$pull: {tasks: idTask}}, {new: true, runValidators:true});
        return res.status(200).json(deletedTask);
    } catch (error) {
        console.log(error);
    }
})

export default taskRoute;

