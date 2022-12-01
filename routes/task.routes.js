import express from "express";
import taskModel from "../model/task.model.js";
import userModel from "../model/user.model.js";

const taskRoute = express.Router();

taskRoute.post("/create-task/:idUser", async (req,res)=>{
    try {
        const {idUser} = req.params;
        const newTask = await taskModel.create({...req.body, user: idUser});
        const userUpdated = await userModel.findByIdAndUpdate(idUser, {$push: {tasks: newTask._id}}, {new: true, runValidators: true});        
        return res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg: "Erro ao criar tarefa"});
    }
});


taskRoute.get("/oneTask/:idTask", async (req,res)=>{
    try {
        const {idTask} = req.params;
        const oneTask = await taskModel.findById(idTask).populate("user");
        return res.status(200).json(oneTask);
    } catch (error) {
        console.log(error);
    }
})


//all-tasks
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


//delete - INTEGRIDADE REFERENCIAL
// quando apagar uma tarefa, retirar o id do array de tarefas do usuário
taskRoute.delete("/delete/:idTask", async (req,res)=>{
    try {
        const {idTask} = req.params;

        //deletar a tarefa
        const deletedTask = await taskModel.findByIdAndDelete(idTask);
        
        //retirar o id da tarefa do usuário
        await userModel.findByIdAndUpdate(deletedTask.user, {$pull: {tasks: idTask}}, {new: true, runValidators:true});
        return res.status(200).json(deletedTask);
    } catch (error) {
        console.log(error);
    }
})

export default taskRoute;