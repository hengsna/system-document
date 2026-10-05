import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Role, User } from '@/models';

export async function GET() {
  await connectToDatabase();
  const roles = await Role.find();
  const rolesWithCount = await Promise.all(roles.map(async (role) => {
    const count = await User.countDocuments({ role_id: role._id });
    const users = await User.find({ role_id: role._id }).select('_id');
    return { ...role.toObject(), count, users: users.map(u => u._id) };
  }));
  return NextResponse.json(rolesWithCount);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { id, name, desc } = body;
  
  if (id) {
    await Role.findByIdAndUpdate(id, { name, description: desc });
  } else {
    const role = new Role({ name, description: desc });
    await role.save();
  }
  return NextResponse.json({ success: true });
}
