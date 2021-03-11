import mongoose from 'mongoose';
export const db =()=>{
     mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true}).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});
}

export const connection = mongoose.createConnection(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})

interface ISessions{
    _id: string,
    expires: Date,
    session: {
        cookie:{
            maxAge: number
            expires: Date,
            secure: boolean,
            path: string,
            passport:{
                user:String
            }
        }
    }
}