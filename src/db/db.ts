import mongoose from "mongoose";

const mongoUsr: string | null = process.env.MONGO_USR || null;
const mongoPwd: string | null = process.env.MONGO_PWD || null;
const databaseName: string = 'poll';
const connectionString: string = `mongodb+srv://${mongoUsr}:${mongoPwd}@cluster0.ykh5k.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(connectionString);
        console.log('MongoDB connected: ', conn.connection.host);
        return conn;
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);   
    }
}
export default connectDb;