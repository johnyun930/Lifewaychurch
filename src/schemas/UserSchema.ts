import mongoose,{Document, Model, Schema} from 'mongoose';
export interface IUser extends Document{
    userName: string,
    hash: string,
    salt: string,
    firstName: string,
    lastName: string,
    email: string
}

export const UserSchema: Schema = new Schema({
    userName: {type:String, required: true, unique: true},
    hash: {type:String, required: true},
    salt: {type:String, required: true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String,required:true,unique:true}
});

export const User = mongoose.model<IUser>('User',UserSchema);
