import {Schema,model} from "mongoose";

const processSchema = new Schema ({
    documentName: {
        type: String,
        required: true
        },
    status: {
        type: String,
        enum: ["Em andamento", "Finalizado"]
        },
    details: {type: String},
    dateInit: {type: Date},
    comments: [{type: String}],
    dateEnd: {type: Date},
    setor: {type: String}
},
{
    timestamp: true
}
)

const processModel = model("Processo", processSchema);

export default processModel;