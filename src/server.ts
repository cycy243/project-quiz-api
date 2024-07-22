import { connect } from 'mongoose';
import { config } from './librairies/config';

config();

connect(process.env.DB_URI!)
    .then(() => {
        require('./app').listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error: any) => console.error(error));