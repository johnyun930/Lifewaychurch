import mongoose from 'mongoose';
export const db =()=>{
     mongoose.connect(`mongodb+srv://johnyun930:taeyeon0309@cluster0.umkpc.mongodb.net/Lifeway`, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});
}

