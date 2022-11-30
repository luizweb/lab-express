import {Schema,model} from "mongoose";

const processSchema = new Schema({
    documentName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['Aberto', 'Finalizado', 'Em andamento'],
        default: 'Aberto'
    },
    details: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 50,
        trim: true
    },
    dateInit: {
        type: Date,
        required: true
      },
    comments: [{type: String}],
    dateEnd: {
        type: Date,
      },
    setor: {
        type: String,
        enum: ['TRE', 'TRJ', 'ENAP', 'SATEC'],
        default: 'ENAP'
    }
},
{
    timestamps: true
})

const processModel = model("Processo", processSchema);

export default processModel;