const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let  mongoServer: any;

export const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(uri, mongooseOpts);
};

export const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};