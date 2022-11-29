import express from "express";

const processRoute = express.Router();


// DADOS --------------------------
const db = [{ 
    "id": "e27ab2b1-cb91-4b18-ab90-5895cc9abd29", 
    "documentName": "Licitação Enap - Curso Web Dev",
    "status": "Em andamento", 
    "details": "Processo para capacitação de servidores públicos em desenvolvimento de aplicações na WEB. Parceria com Ironhack", 
    "dateInit": "28/11/2022", 
    "comments": [
                  "Processo aberto", "Processo partiu para as partes assinarem", 
                  "Processo agora está em análise final", "Processo já tem data final"
              ], 
    "dateEnd": "16/12/2022", 
    "setor": "enap" 
  }, 
  { 
    "id": "ee5999d7-02e9-4b3d-a1ab-f067eef54173", 
    "documentName": "Licitação Compras - Notebooks", 
    "status": "Em andamento", 
    "details": "Processo de licitação para compra de notebooks", 
    "dateInit": "30/11/2022", 
    "comments": [
                  "Processo em aberto e sem previsão de conclusão"
              ], 
    "dateEnd": "", 
    "setor": "tre" 
  }, 
  { 
    "id": "ee5999d7-02e9-4b3d-a1ab-f067eef54173", 
    "documentName": "Licitação Compras - Ar Condicionado", 
    "status": "Finalizado", 
    "details": "Processo de licitação para compra de ar-condicionado", 
    "dateInit": "15/11/2022", 
    "comments": [
                  "Processo em aberto", "Processo finalizado"
              ], 
    "dateEnd": "25/11/2022", 
    "setor": "trj" 
  } ]


// ROTAS ---------------------------

// GET --> /all
processRoute.get("/all", (req,res)=>{
    return res.status(200).json(db);
});

// POST --> /create
processRoute.post("/create", (req,res)=>{
    const form = req.body;
    db.push(form);
    return res.status(201).json(db);
});

//PUT --> /edit/:id
processRoute.put("/edit/:id", (req,res)=>{
    const {id} = req.params;
    const updateById = db.find(item=>item.id === id);
    const index = db.indexOf(updateById);

    db[index] = {...updateById, ...req.body};
    
    return res.status(200).json(db[index]);
});

//DELETE --> /delete/:id
processRoute.delete("/delete/:id", (req,res)=>{
    const {id} = req.params;
    const deleteById = db.find(item=>item.id === id);
    
    // verificação caso o id não exista
    if (!deleteById){
        return res.status(400).json({msg: "usuário não encontrado"})        
    }
    
    const index = db.indexOf(deleteById);

    db.splice(index, 1);
    
    return res.status(200).json(db);
})

//PROCESS BY ID
processRoute.get("/process/:id", (req,res)=>{
    const {id} = req.params;
    const processById = db.find(item=>item.id === id);

    return res.status(200).json(processById);
})


// ADD COMMENT
processRoute.put("/addComment/:id", (req,res)=>{
    const {id} = req.params;
    const addComment = db.find(item=>item.id === id);
    addComment.comments.push(req.body.comments);

    return res.status(200).json(db);
});

// STATUS EM ANDAMENTO
processRoute.get("/status/open", (req,res)=>{    
    const processByStatus = db.filter(item=>item.status === "Em andamento");
    return res.status(200).json(processByStatus);
});

// STATUS FINALIZADOS
processRoute.get("/status/close", (req,res)=>{    
    const processByStatus = db.filter(item=>item.status === "Finalizado");
    return res.status(200).json(processByStatus);
})


// SETOR
processRoute.get("/setor/:nomeSetor", (req,res)=>{
    const {nomeSetor} = req.params;
    const processBySetor = db.filter(item=>item.setor === nomeSetor);

    return res.status(200).json(processBySetor);
})

// RANDOM
processRoute.get("/random", (req,res)=>{    
    const dbLength = db.length;
    return res.status(200).json(db[Math.floor(Math.random() * dbLength)]);
})


export default processRoute;