import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { User } from '@/models';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const { user_ids } = body;
  const { id } = params;

  // Unassign anyone currently having this role
  await User.updateMany({ role_id: id }, { $set: { role_id: null } });
  
  // Assign new users
  if (user_ids && user_ids.length > 0) {
    await User.updateMany({ _id: { $in: user_ids } }, { $set: { role_id: id } });
  }
  
  return NextResponse.json({ success: true });
}
