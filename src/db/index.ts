import mongoose from 'mongoose';
export const db = ()=>{ mongoose.connect(process.env.DB_PORT!, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Connected to MongoDB")).catch(()=>{
    throw new Error("Mongo DB Error");
})}