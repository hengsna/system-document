import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectToDatabase();

  let user = await User.findOne({ name: 'admin' });
  if (!user) {
    user = new User();
  }
  
  const hashedPassword = await bcrypt.hash('admin123@', 10);
  
  user.name = 'admin';
  user.email = 'admin@example.com';
  user.password = hashedPassword;
  user.status = 'Active';
  user.permissions = JSON.stringify(['create', 'edit', 'delete', 'modify']);
  await user.save();

  return NextResponse.json({ success: true, message: 'Admin user created or updated!' });
}
