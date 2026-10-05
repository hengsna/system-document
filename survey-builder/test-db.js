const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected!');
    process.exit(0);
}).catch(err => {
    console.error(err.message);
    process.exit(1);
});
