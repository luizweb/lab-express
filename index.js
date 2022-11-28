import express from "express";
import * as dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(express.json());


// DADOS --------------------------
const processos = [{ 
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
app.get("/all", (req,res)=>{
    return res.status(200).json(processos);
});

// POST --> /create
app.post("/create", (req,res)=>{
    const form = req.body;
    processos.push(form);
    return res.status(201).json(processos);
});

//PUT --> /edit/:id
app.put("/edit/:id", (req,res)=>{
    const {id} = req.params;
    const updateById = processos.find(processo=>processo.id === id);
    const index = processos.indexOf(updateById);
    const clone = {...updateById, ...req.body}; 

    processos[index] = clone;
    
    return res.status(200).json(processos);
});

//DELETE --> /delete/:id
app.delete("/delete/:id", (req,res)=>{
    const {id} = req.params;
    const deleteById = processos.find(processo=>processo.id === id);
    const index = processos.indexOf(deleteById);

    processos.splice(index, 1);
    
    return res.status(200).json(processos);
})

//PROCESS BY ID
app.get("/process/:id", (req,res)=>{
    const {id} = req.params;
    const processById = processos.find(processo=>processo.id === id);

    return res.status(200).json(processById);
})


// ADD COMMENT
app.put("/addComment/:id", (req,res)=>{
    const {id} = req.params;
    const addComment = processos.find(processo=>processo.id === id);
    addComment.comments.push(req.body.comments);

    return res.status(200).json(processos);
});

// STATUS EM ANDAMENTO
app.get("/status/open", (req,res)=>{    
    const processByStatus = processos.filter(processo=>processo.status === "Em andamento");
    return res.status(200).json(processByStatus);
});

// STATUS FINALIZADOS
app.get("/status/close", (req,res)=>{    
    const processByStatus = processos.filter(processo=>processo.status === "Finalizado");
    return res.status(200).json(processByStatus);
})


// SETOR
app.get("/setor/:nomeSetor", (req,res)=>{
    const {nomeSetor} = req.params;
    const processBySetor = processos.filter(processo=>processo.setor === nomeSetor);

    return res.status(200).json(processBySetor);
})

// RANDOM
app.get("/random", (req,res)=>{    
    const nrProcessos = processos.length;
    return res.status(200).json(processos[Math.floor(Math.random() * nrProcessos)]);
})




//--------------------------------------------------------------------------------
app.listen(process.env.PORT, ()=>{
    console.log(`App up and running on port http://localhost:${process.env.PORT}`)
});

