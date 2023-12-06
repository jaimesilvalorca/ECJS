import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Date,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: {
        type: String,
        default: 'user'
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        default: null
    }
});

mongoose.set("strictQuery", false);
const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
