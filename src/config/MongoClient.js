import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export default class MongoClient{
    constructor(){
        this.connected = true,
        this.client = mongoose
    }

    connect = async() =>{
        try {
            await this.client.connect(process.env.URI)
            
        } catch (error) {
            console.log(error)
        }
    }
}