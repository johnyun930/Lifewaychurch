import mongoose,{ Document, Schema} from 'mongoose';

export interface IToken extends Document{
    token?: string,
    email?: string,
    code?: string,
    userName?: string,
    expireAt: Date
}


export const TokenSchema: Schema = new Schema({
    token: String,
    userName: String,
    code: String,
    email: String,
    expireAt: Date
});

TokenSchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
export const Token = mongoose.model<IToken>('Token',TokenSchema);
