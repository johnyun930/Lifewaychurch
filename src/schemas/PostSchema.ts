import mongoose,{ Document, Schema} from 'mongoose';
export interface IPost extends Document{
    id: number,
    title: string,
    context: string,
    composer: string,
    bibleText?:string,
    date: Date
    notice: boolean,
    file?: string
}

export const PostSchema: Schema = new Schema({
    id: {type:Number, required: true, unique: true},
    title: {type:String,required: true},
    context: {type:String,required:true},
    composer: {type:String,required:true},
    date: {type:Date,required:true},
    notice: {type:Boolean,required:true}, 
    bibleText:String,
    file:String

});

export const BibleStudy = mongoose.model<IPost>('Biblestudy',PostSchema);
export const QT = mongoose.model<IPost>('QT',PostSchema);
export const ChildSchool = mongoose.model<IPost>('ChildSchool',PostSchema);
export const BulletenBoard = mongoose.model<IPost>('BulletenBoard',PostSchema);
