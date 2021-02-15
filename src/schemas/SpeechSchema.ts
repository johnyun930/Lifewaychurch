import mongoose, {Document,Schema} from 'mongoose';

export interface Speech extends Document{
    title: string,
    context?: string,
    videoURL?: string
}

export const SpeechSchema = new Schema({
    title: {type:String,require:true},
    content: String,
    videoURL: String
});

export const User = mongoose.model<Speech>('Speech',SpeechSchema);
