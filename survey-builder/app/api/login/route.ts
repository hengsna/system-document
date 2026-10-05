import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { username, password } = body;

  const user = await User.findOne({ name: username });
  
  if (user && await bcrypt.compare(password, user.password)) {
    return NextResponse.json({ success: true, user });
  }
  
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
