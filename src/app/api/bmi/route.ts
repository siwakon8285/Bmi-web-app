import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateBMI } from '@/lib/bmi';

// GET: Fetch user's BMI history
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const records = db.prepare('SELECT * FROM bmi_records WHERE user_id = ? ORDER BY created_at DESC').all(session.user.id);
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

    const result = db.prepare(
      'INSERT INTO bmi_records (user_id, weight, height, bmi_value) VALUES (?, ?, ?, ?)'
    ).run(session.user.id, weight, height, bmiValue);

    return NextResponse.json({ message: 'Record added', id: result.lastInsertRowid, bmiValue }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving record' }, { status: 500 });
  }
}
