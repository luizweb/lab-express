import express from "express";
import * as dotenv from "dotenv";

import connect from "./config/db.config.js";

import userRoute from "./routes/user.routes.js"
import processRoute from "./routes/process.routes.js";
import taskRoute from "./routes/task.routes.js";

// dotenv
dotenv.config();

// express
const app = express();
app.use(express.json());

//conectando com o banco de dados
connect();

// ROTAS ---------------------

// raiz
app.get("/", (req,res)=>{    
    const bemVindo = "Bem vindo!!!"
    return res.status(200).json({msg: bemVindo})
})

// rotas únicas
app.use("/user", userRoute);
app.use("/process", processRoute);
app.use("/task", taskRoute);


//listen -------------------------------------------------------------------------
app.listen(process.env.PORT, ()=>{
    console.log(`App up and running on port http://localhost:${process.env.PORT}`)
});

