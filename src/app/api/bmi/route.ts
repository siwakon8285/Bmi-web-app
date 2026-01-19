import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateBMI } from '@/lib/bmi';

// GET: Fetch user's BMI history
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows: records } = await sql`
      SELECT * FROM bmi_records 
      WHERE user_id = ${session.user.id} 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching records' }, { status: 500 });
  }
}

// POST: Add new BMI record
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { weight, height } = await request.json();
    const bmiValue = calculateBMI(weight, height);

    const result = await sql`
      INSERT INTO bmi_records (user_id, weight, height, bmi_value) 
      VALUES (${session.user.id}, ${weight}, ${height}, ${bmiValue})
      RETURNING id
    `;
    
    const id = result.rows[0].id;

    return NextResponse.json({ message: 'Record added', id, bmiValue }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving record' }, { status: 500 });
  }
}
