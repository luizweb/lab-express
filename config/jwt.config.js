import jwt from "jsonwebtoken";

// -------- Essa função será chamada no momento do login do usuário!!! ----------

function generateToken(user){
    // user --> é o usuário para quem eu vou criar esse token
    // user --> vem do banco de dados

    // propriedades que eu escolhi guardar no meu token
    const {_id, email, role} = user // payload (informações que estão guardadadas no token)

    //signature --> secret key. é a assinatura que prova que foi essa aplicação que criou o token
    const signature = process.env.TOKEN_SIGN_SECRET

    //expiration define por quanto tempo o token será válido
    const expiration = "12h"

    //essa função vai retornar o token assinado
    //argumentos da função sign()
        // 1º payload: quais as informações que vamos guardar dentreo do token
        // 2º assinatura: signature
        // 3º config: determino a expiração do token
    return jwt.sign({_id, email, role}, signature, {expiresIn: expiration});

}

export default generateToken;