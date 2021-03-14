import mongoose from 'mongoose';
export const db =()=>{
//      mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true}).then(()=>{
//     console.log('connect to MongoDB');
// }).catch((err)=>{
//     console.log(err);
// });

    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME+":"+process.env.DB_PASSWORD}@cluster0.umkpc.mongodb.net/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true}).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});
}


