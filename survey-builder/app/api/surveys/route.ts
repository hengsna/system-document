import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Survey } from '@/models';

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { schema, status } = body;
  
  if (!schema || !schema.settings || !schema.settings.form_id) {
    return NextResponse.json({ success: false, message: 'Invalid schema' }, { status: 400 });
  }
  
  const form_id = schema.settings.form_id;
  const title = schema.settings.form_title || 'Untitled Survey';
  
  const survey = await Survey.findOneAndUpdate(
    { form_id },
    { title, schema, status: status || 'Draft' },
    { upsert: true, new: true }
  );
  
  return NextResponse.json({ success: true, survey });
}

export async function GET() {
  await connectToDatabase();
  const surveys = await Survey.find().sort({ created_at: -1 });
  return NextResponse.json({ success: true, surveys });
}
