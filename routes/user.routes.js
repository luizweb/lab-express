import express from "express";
import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";

const userRoute = express.Router();


// -----------------------------------------------------
// CRIAÇÃO DAS ROTAS - req (REQUISIÇÃO), res (RESPOSTA)
// -----------------------------------------------------

//GET -  all-users
userRoute.get("/all-users", async (req,res)=>{    
    try {
        const users = await userModel.find({},{__v:0, updatedAt:0}).sort({age:1});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar todos os usuários'});
    }
});

//GET - one-user (findById - mongoose)
userRoute.get("/one-user/:id", async (req,res)=>{    
    try {
        const {id} = req.params;
        const user = await userModel.findById(id).populate("tasks");

        if (!user){
            return res.status(400).json({msg: "Usuário não encontrado"});
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar um usuário'});
    }
});

// POST - new-user (create - mongoose)
userRoute.post("/new-user", async (req, res)=>{
    try {
        const newUser = await userModel.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao criar um novo usuário'});
    }
})

// DELETE (findByIdAndDelete - mongoose)
userRoute.delete("/delete/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser){
            return res.status(400).json({msg: "Usuário não encontrado"});
        }

        // delete all tasks from user - deleteMany
        await taskModel.deleteMany({user: id}); 

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao deletar um usuário'});
    }
});

// UPDATE (findByIdAndUpdate - mongoose)
userRoute.put("/edit/:id", async (req,res)=>{
    try {
        const { id } = req.params;

        // new: true --> retorna a atualização realizada
        // runValidators: true --> realizada as verificações do Schema (user.model.js)
        const updatedUser = await userModel.findByIdAndUpdate(id, {...req.body}, {new: true, runValidators: true});
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao editar um usuário'});
    }
})

export default userRoute;

