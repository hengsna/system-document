import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Indicator } from '@/models';

export async function GET() {
  await connectToDatabase();
  const indicators = await Indicator.find().populate('program_id', 'name').populate('responsible_role_id', 'name');
  
  const mapped = indicators.map(ind => {
    const obj = ind.toObject();
    return {
      ...obj,
      program_name: obj.program_id ? (obj.program_id as any).name : '',
      role_name: obj.responsible_role_id ? (obj.responsible_role_id as any).name : ''
    };
  });
  
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { id, program_id, indicator, baseline, target, data_source, frequency, responsible_role_id } = body;
  
  const data = {
    program_id,
    indicator,
    baseline,
    target,
    data_source,
    frequency,
    responsible_role_id
  };
  
  if (id) {
    await Indicator.findByIdAndUpdate(id, data);
  } else {
    const ind = new Indicator(data);
    await ind.save();
  }
  return NextResponse.json({ success: true });
}
