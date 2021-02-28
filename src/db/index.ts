import mongoose from 'mongoose';
export const db =()=>{
     mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});
}

// mongodb+srv://${process.env.DB_USERNAME}