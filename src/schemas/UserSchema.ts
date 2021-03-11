import mongoose,{Document, Model, Schema} from 'mongoose';
export interface IUser extends Document{
    userName: string,
    hash: string,
    salt: string,
    firstName: string,
    lastName: string,
    email: string,
    isAdmin:boolean
}

export const UserSchema: Schema = new Schema({
    userName: {type:String, required: true, unique: true},
    hash: {type:String, required: true},
    salt: {type:String, required: true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String,required:true,unique:true},
    isAdmin:Boolean

});

export interface ISession extends Document{
    _id: string,
    expires: Date,
    session: {
        cookie:{
            maxAge: number
            expires: Date,
            secure: boolean,
            path: string,
           
        }
        passport:{
            user:String
        }
    }
}

export const SessionSchema: Schema = new Schema({
    _id: {type:String, required: true, unique: true},
    expires: {type:Date,required:true},
    sessions: {
        cookie:{
            maxAge: Number,
            expires: Date,
            secure: Boolean,
            path: String,
           
        },
        passport:{
            user:String
        }
    }
})

export const User = mongoose.model<IUser>('User',UserSchema);
export const Session = mongoose.model<ISession>('Session',SessionSchema);
