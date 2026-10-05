import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { User, Role } from '@/models';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectToDatabase();
  const users = await User.find().populate('role_id', 'name');
  const mappedUsers = users.map(u => {
    const obj = u.toObject();
    obj.role = obj.role_id ? (obj.role_id as any).name : null;
    obj.permissions = obj.permissions ? JSON.parse(obj.permissions) : [];
    return obj;
  });
  return NextResponse.json(mappedUsers);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { id, name, email, role, status, permissions } = body;
  
  let user;
  if (id) {
    user = await User.findById(id);
  } else {
    user = new User();
    user.password = await bcrypt.hash('password', 10);
  }
  
  user.name = name;
  user.email = email;
  user.status = status || 'Active';
  user.permissions = JSON.stringify(permissions || []);
  
  if (role) {
    const r = await Role.findOne({ name: role });
    if (r) user.role_id = r._id;
  }
  
  await user.save();
  return NextResponse.json({ success: true });
}
