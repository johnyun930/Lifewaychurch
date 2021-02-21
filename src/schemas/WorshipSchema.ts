import mongoose, {Document,Schema} from 'mongoose';

export interface IWorship extends Document{
    title: string,
    date: Date,
    offering: string,
    prayer: string,
    startingHymm: string,
    bibleText: string,
    context?: string,
    videoURL?: string,
    endingHymm: string
}

export const WorshipSchema = new Schema({
    title: {type:String,require:true},
    date: Date,
    prayer: String,
    offering: String,
    startingHymm: String,
    bibleText: String,
    context: String,
    videoURL: String,
    endingHymm: String
});

export const Worship = mongoose.model<IWorship>('Worship',WorshipSchema);
