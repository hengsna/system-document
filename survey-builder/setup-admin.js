const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  status: { type: String, default: 'Active' },
  permissions: { type: String, default: '[]' }
});
const User = mongoose.model('User', UserSchema);

async function setup() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    let user = await User.findOne({ name: 'admin' });
    if (!user) user = new User();
    
    user.name = 'admin';
    user.email = 'admin@example.com';
    user.password = await bcrypt.hash('admin123@', 10);
    user.status = 'Active';
    user.permissions = JSON.stringify(['create', 'edit', 'delete', 'modify']);
    
    await user.save();
    console.log('Admin user successfully created/updated in MongoDB!');
    process.exit(0);
}
setup().catch(err => { console.error(err); process.exit(1); });
