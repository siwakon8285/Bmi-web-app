import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  // Strict Admin Check
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly, yearly

    // 1. Key Metrics
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role != "admin"').get() as any;
    const avgBMI = db.prepare('SELECT AVG(bmi_value) as avg FROM bmi_records').get() as any;
    
    // Obesity Rate (BMI >= 30)
    const totalRecords = db.prepare('SELECT COUNT(*) as count FROM bmi_records').get() as any;
    const obeseRecords = db.prepare('SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 30').get() as any;
    const obesityRate = totalRecords.count > 0 ? (obeseRecords.count / totalRecords.count) * 100 : 0;

    // 2. BMI Distribution (for Doughnut Chart)
    const distribution = {
      underweight: db.prepare('SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value < 18.5').get() as any,
      normal: db.prepare('SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 18.5 AND bmi_value < 25').get() as any,
      overweight: db.prepare('SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 25 AND bmi_value < 30').get() as any,
      obese: db.prepare('SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 30').get() as any,
    };

    // 3. Trend Analysis (for Line Chart) - Simplified logic based on period
    // In a real app, we'd use complex SQL date grouping (strftime in SQLite)
    let dateFormat = '%Y-%m-%d'; // default daily
    let limit = 30;

    if (period === 'weekly') {
      dateFormat = '%Y-%W';
      limit = 12;
    } else if (period === 'monthly') {
      dateFormat = '%Y-%m';
      limit = 12;
    } else if (period === 'yearly') {
      dateFormat = '%Y';
      limit = 5;
    }

    const trendQuery = `
      SELECT strftime('${dateFormat}', created_at) as date_label, AVG(bmi_value) as avg_bmi 
      FROM bmi_records 
      GROUP BY date_label 
      ORDER BY date_label ASC 
      LIMIT ?
    `;
    const trends = db.prepare(trendQuery).all(limit);

    return NextResponse.json({
      metrics: {
        totalUsers: totalUsers.count,
        avgBMI: avgBMI.avg ? avgBMI.avg.toFixed(2) : 0,
        obesityRate: obesityRate.toFixed(1),
      },
      distribution: [
        distribution.underweight.count,
        distribution.normal.count,
        distribution.overweight.count,
        distribution.obese.count,
      ],
      trends,
    });

  } catch (error) {
    console.error('MIS API Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
