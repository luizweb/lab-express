import express from "express";
import processModel from "../model/process.model.js"

const processRoute = express.Router();


// GET --> /all
processRoute.get("/all-process", async (req,res)=>{
    try {
        const process = await processModel.find();
        return res.status(200).json(process);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar todos os processos'});
    }
});

// GET by id
processRoute.get("/one-process/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const process = await processModel.findById(id);

        if (!process){
            return res.status(400).json({msg: 'Processo não encontrado'});
        }

        return res.status(200).json(process);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar um processos'});
    }
})


// POST --> /create
processRoute.post("/new-process", async (req,res)=>{
    try {
        const newProcess = await processModel.create(req.body);
        return res.status(201).json(newProcess);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao cadastrar novo processos'});
    }
});

//DELETE
processRoute.delete("/delete/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const processDelete = await processModel.findByIdAndDelete(id);

        if (!processDelete){
            return res.status(400).json({msg: 'Processo não encontrado'});
        }

        return res.status(200).json(processDelete);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao apagar um processo'});        
    }
})

// UPDATE
processRoute.put("/edit/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const updateProcess = await processModel.findByIdAndUpdate(id, {...req.body}, {new: true, runValidators: true});
        return res.status(200).json(updateProcess);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao editar um processo'});   
    }
})





// ADD COMMENT
processRoute.put("/addComment/:id", async (req,res)=>{
    try {
        const {id} = req.params;
        const addComment = await processModel.findByIdAndUpdate(id,{$push : { comments: [req.body.comments] }}, {new: true, runValidators: true})
        return res.status(200).json(addComment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao adicionar um comentário'});
}
    
    
     
});

// STATUS EM ABERTO
processRoute.get("/status/open", async (req,res)=>{    
    try {
        const process = await processModel.find({status:"Aberto"});
        return res.status(200).json(process);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar processos em aberto'});
    }
        
});

// STATUS FINALIZADOS
processRoute.get("/status/close", async (req,res)=>{    
    try {
        const process = await processModel.find({status:"Finalizado"});
        return res.status(200).json(process);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar processos finalizados'});
    }
});


// SETOR
processRoute.get("/setor/:nomeSetor", async (req,res)=>{
    try {
        const process = await processModel.find({setor: req.params.nomeSetor});
        return res.status(200).json(process);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Erro ao consultar um setor'});
    }
})

// RANDOM
processRoute.get("/random", async (req,res)=>{    
    const index = Math.floor(Math.random() * (await processModel.count()));
    const process = await processModel.find({}).skip(index).limit(1);
    return res.status(200).json(process[0]);
})


export default processRoute;