import mongoose from 'mongoose';

export default async (mongoUri: any): Promise<boolean> => {
    try {
        await mongoose.connect(mongoUri)
        console.log('CONNECTED TO MONGO')
        return true;
    } catch (error) {
        console.log('MONGO START ERROR: ', error)
        return false; // createError 만들기 전에 임시.
    }
}