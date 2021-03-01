import mongoose from 'mongoose';
export const db =()=>{
     mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSOWRD}cluster0.umkpc.mongodb.net/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});
}

