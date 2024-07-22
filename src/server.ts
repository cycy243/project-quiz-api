import { MongoClient } from 'mongodb';
import { config } from './librairies/config';

config();

new MongoClient(process.env.DB_URI!)
    .connect()
    .then(() => {
        require('./app').listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch(error => console.error(error));