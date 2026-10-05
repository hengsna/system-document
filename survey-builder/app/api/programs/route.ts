import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Program } from '@/models';

export async function GET() {
  await connectToDatabase();
  const programs = await Program.find();
  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { id, name, description } = body;
  
  if (id) {
    await Program.findByIdAndUpdate(id, { name, description });
  } else {
    const p = new Program({ name, description });
    await p.save();
  }
  return NextResponse.json({ success: true });
}
