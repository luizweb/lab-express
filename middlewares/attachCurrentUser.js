// middleware
// next --> próximo passo

import userModel from "../models/user.model.js";

async function attachCurrentUser(req, res, next) {
    try {
        // consome o req.auth (gerado pelo middleware isAuth)
        const userData = req.auth;
        const user = await userModel.findById(userData._id, {passwordHash: 0});

        //confirmar se o user existe
        if (!user){
            return res.status(400).json({msg: "Usuário não encontrado"});
        }

        //posso criar CHAVES dentro dessa reuisição (req.currentUser)
        req.currentUser = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

export default attachCurrentUser;