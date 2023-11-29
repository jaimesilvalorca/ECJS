import mongoose from "mongoose";

export default class MongoClient{
    constructor(){
        this.connected = true,
        this.client = mongoose
    }

    connect = async() =>{
        try {
            await this.client.connect('mongodb://127.0.0.1:27017/ecommerce')
            
        } catch (error) {
            console.log(error)
        }
    }
}