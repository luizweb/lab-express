import {Schema, model} from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    },
    birth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["masculino","feminino","não informado"]
    },
    role: {
        type: String,
        enum: ["ADMIN","USER"],
        default: "USER"
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    image: {
        type: String
    },    
    active: {
        type: Boolean,
        default: true
    },
    tasks: [{type: Schema.Types.ObjectId, ref:"Task"}],
    passwordHash: {
        type: String, 
        required: true
    }
    },
    {
        timestamps: true,
    }
);

const userModel = model("User", userSchema);

export default userModel;

