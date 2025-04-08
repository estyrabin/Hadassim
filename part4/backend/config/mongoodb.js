import mongoose from "mongoose";

/*
    Conect to the MongoDB  dadabase
*/
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('DB connected'));
        mongoose.connection.on('error', (err) => console.error('DB connection error:', err));

        await mongoose.connect(`${process.env.MONGODB_URI}/shop`);

    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};


export default connectDB;
