import express from "express";
import userModel from "../model/user.model.js";

const userRoute = express.Router()


// "banco de dados" - array de objetos para teste
const bancoDados = [
    {
        id: "d96a1e0d-f6a1-4790-8f7f-91ccf727f85a",
        name: "Luiz",
        age: 43,
        role: "student",
        active: true,
        tasks: [
            "estudar mongodb",
            "CRUD no mongodb"
        ]
    }
]

// -----------------------------------------------------
// CRIAÇÃO DAS ROTAS - req (REQUISIÇÃO), res (RESPOSTA)
// -----------------------------------------------------

// RAIZ
userRoute.get("/", (req,res)=>{    
    const bemVindo = "Bem vindo!!!"
    return res.status(200).json({msg: bemVindo})
})


//GET -  CRIAR UMA ROTA QUE RETORNA O BANCO DE DADOS
userRoute.get("/all-users", async (req,res)=>{    
    try {
        const users = await userModel.find();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar todos os usuários'})
    }
    
    //--- antigo, sem banco de dados mongodb
    //return res.status(200).json(bancoDados);
})

// POST - create
userRoute.post("/new-user", async (req, res)=>{
    try {
        const newUser = await userModel.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao criar um novo usuário'})
    }


    //--- antigo, sem banco de dados mongodb
    //console.log(req.body);
    //const form = req.body;
    //bancoDados.push(form);
    //return res.status(201).json(bancoDados)
})

// DELETE
userRoute.delete("/delete/:id", (req,res)=>{
    //console.log(req.params);
    const {id} = req.params; //desconstruindo
    //console.log(id); 

    const deleteById = bancoDados.find(user=>user.id === id)
    const index = bancoDados.indexOf(deleteById)

    bancoDados.splice(index, 1);

    return res.status(200).json(bancoDados)
})

export default userRoute;