import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import { Province, District, Commune, Village } from '@/models';

export async function GET() {
  await connectToDatabase();
  const provinces = await Province.find();
  const db: any = {};
  
  for (const p of provinces) {
    const p_key = p.name.toLowerCase().replace(/\s+/g, '_');
    db[p_key] = { id: p._id, name: p.name, districts: {} };
    
    const districts = await District.find({ province_id: p._id });
    for (const d of districts) {
      const d_key = d.name.toLowerCase().replace(/\s+/g, '_');
      db[p_key].districts[d_key] = { id: d._id, name: d.name, communes: {} };
      
      const communes = await Commune.find({ district_id: d._id });
      for (const c of communes) {
        const c_key = c.name.toLowerCase().replace(/\s+/g, '_');
        db[p_key].districts[d_key].communes[c_key] = { id: c._id, name: c.name, villages: [] };
        
        const villages = await Village.find({ commune_id: c._id });
        for (const v of villages) {
          db[p_key].districts[d_key].communes[c_key].villages.push(v.name);
        }
      }
    }
  }
  
  return NextResponse.json(db);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { type, name, parentName } = body;
  
  if (type === 'province') {
    await new Province({ name }).save();
  } else if (type === 'district') {
    const p = await Province.findOne({ name: parentName });
    if (p) await new District({ name, province_id: p._id }).save();
  } else if (type === 'commune') {
    const d = await District.findOne({ name: parentName });
    if (d) await new Commune({ name, district_id: d._id }).save();
  } else if (type === 'village') {
    const c = await Commune.findOne({ name: parentName });
    if (c) await new Village({ name, commune_id: c._id }).save();
  }
  
  return NextResponse.json({ success: true });
}
