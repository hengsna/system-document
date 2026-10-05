import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Program } from '@/models';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  await Program.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
