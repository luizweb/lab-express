
import express from "express";
import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";

import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const userRoute = express.Router();


// -----------------------------------------------------
// CRIAÇÃO DAS ROTAS - req (REQUISIÇÃO), res (RESPOSTA)
// -----------------------------------------------------


// ----------------------------------------------------------------------------

// AUTENTICAÇÃO

const saltRound = 10; // quantidade de caracteres da minha string 'salt'. 10 é o padrão.

// ---- SIGN UP --------
// criando um usuário no nosso banco de dados
// passwordHash
userRoute.post("/sign-up", async (req,res)=>{    
    try {
        // capturando a senha do meu req.body
        const {password} = req.body;

        //regex para confirmar se a senha passou nos pré-requisitos (8 caracteres, maiúsculas, minúsculas, números e caracteres especiais)
        if (!password || !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/)){   
            return res.status(400).json({msg: 'Senha não tem os requisitos mínimos de segurança'})
        };

        //gerar salt com a quantidade de saltos definida (10)
        // precisa do await pois demora para gerar o salt
        //caraceters aleatórios que serão concatenadas na minha senha
        const salt = await bcrypt.genSalt(saltRound); //10

        //chamar a função hash da biblioteca e passar a senha juntamente com o salt criado
        // senha hasheada
        const hashedPassword = await bcrypt.hash(password, salt);

        // criar o usuário
        const newUser = await userModel.create({...req.body, passwordHash: hashedPassword});
        
        //deletar o campo da senha antes de devolver o usuário para a response
        //deleto a propriedade passwordHash do objeto
        delete newUser._doc.passwordHash;
        
        return res.status(201).json(newUser)

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro'});
    }
});


// ------ LOGIN -------
// comparando a senha enviada pelo usuário com a senha hasheada do BD
// devolvendo um token de acesso com as informações do meu usuário (_id, email, role)-por exemplo
userRoute.post("/login", async (req,res)=>{    
    try {
        // capturando o email e password do req.body
        const {email, password} = req.body;

        //achar o usuário no banco de dados pelo email
        const user = await userModel.findOne({email: email});

        // checar se o email existe no banco de dados
        if (!user){
            return res.status(400).json({msg: "Usuário não cadastrado"})
        }

        //comparar a senha que o usuário enviou com a senha hasheada que está no meu banco de dados
        //bcrypt tem um método chamado .compare(senha que o usuário enviou, a senha hasheada)
        if (await bcrypt.compare(password, user.passwordHash)){
            // apagar o passwordHash do objeto
            delete user._doc.passwordHash;
            
            // se a comparação for true, a senha são iguais
            // devolver ao usuário um token de acesso
            // jwt.config.js

            const token = generateToken(user);

            return res.status(200).json({
                user: user,
                token: token
            })
        } else {
            return res.status(400).json({msg: "Email ou Senha inválido"});
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro'});
    }
});


//--- USER PROFILE -----
// middlewares: isAuth e attachCurrentUser
// não precisa mais colocar parâmentros (:id, por exemplo)
// isAuth --> valida se o token que o usuário está enviando foi criado pela nossa aplicação; Extraindo o 'payload' (informação) -> req.auth; next (vai para o próximo)
// attachCurrentUser --> consome o req.auth (gerado pelo middleware isAuth). Com o _id ele acha o usuário dono do token. Cria a chave chamada: req.currentUser

userRoute.get("/profile", isAuth, attachCurrentUser, async (req,res)=>{
    try {
        //req.currentUser --> veio do middleware attachCurrentUser
        return res.status(200).json(req.currentUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro'});
    }
})

//ADMIN - lista todos os usuários
userRoute.get("/admin", isAuth, isAdmin, attachCurrentUser, async (req,res)=>{    
    try {
        const users = await userModel.find({},{passwordHash: 0});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar todos os usuários'});
    }
});


// -----------------------------------------------------------------






//GET -  all-users
userRoute.get("/all-users", async (req,res)=>{    
    try {
        const users = await userModel.find({},{__v:0, updatedAt:0}).sort({age:1}).populate("tasks", "title");
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

