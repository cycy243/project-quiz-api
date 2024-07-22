const path = require('path');
import { config as dotEnvConfig } from 'dotenv';

export function config() {
    dotEnvConfig({
        path: path.resolve(`${process.env.NODE_ENV || "development"}.env`)
    });
}