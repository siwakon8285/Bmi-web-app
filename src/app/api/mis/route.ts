import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
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
    const { rows: totalUsersRows } = await sql`SELECT COUNT(*) as count FROM users WHERE role != 'admin'`;
    const { rows: avgBMIRows } = await sql`SELECT AVG(bmi_value) as avg FROM bmi_records`;
    
    // Obesity Rate (BMI >= 30)
    const { rows: totalRecordsRows } = await sql`SELECT COUNT(*) as count FROM bmi_records`;
    const { rows: obeseRecordsRows } = await sql`SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 30`;
    
    const totalRecordsCount = parseInt(totalRecordsRows[0].count);
    const obeseRecordsCount = parseInt(obeseRecordsRows[0].count);
    const obesityRate = totalRecordsCount > 0 ? (obeseRecordsCount / totalRecordsCount) * 100 : 0;

    // 2. BMI Distribution (for Doughnut Chart)
    const { rows: underweightRows } = await sql`SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value < 18.5`;
    const { rows: normalRows } = await sql`SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 18.5 AND bmi_value < 25`;
    const { rows: overweightRows } = await sql`SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 25 AND bmi_value < 30`;
    const { rows: obeseRows } = await sql`SELECT COUNT(*) as count FROM bmi_records WHERE bmi_value >= 30`;

    // 3. Trend Analysis (for Line Chart)
    // Postgres uses TO_CHAR for date formatting instead of strftime
    let limit = 30;

    if (period === 'weekly') {
      limit = 12;
    } else if (period === 'monthly') {
      limit = 12;
    } else if (period === 'yearly') {
      limit = 5;
    }

    // We can't use template literals for the format string inside TO_CHAR easily with sql`` tagging in a dynamic way if we want to be safe, 
    // but here we control the dateFormat variable strictly.
    // However, vercel/postgres template literal requires values to be parameters.
    // We can just construct the query carefully or use conditional logic.
    
    let trendQuery;
    if (period === 'weekly') {
        trendQuery = await sql`
            SELECT TO_CHAR(created_at, 'YYYY-IW') as date_label, AVG(bmi_value) as avg_bmi 
            FROM bmi_records 
            GROUP BY date_label 
            ORDER BY date_label ASC 
            LIMIT ${limit}
        `;
    } else if (period === 'monthly') {
        trendQuery = await sql`
            SELECT TO_CHAR(created_at, 'YYYY-MM') as date_label, AVG(bmi_value) as avg_bmi 
            FROM bmi_records 
            GROUP BY date_label 
            ORDER BY date_label ASC 
            LIMIT ${limit}
        `;
    } else if (period === 'yearly') {
        trendQuery = await sql`
            SELECT TO_CHAR(created_at, 'YYYY') as date_label, AVG(bmi_value) as avg_bmi 
            FROM bmi_records 
            GROUP BY date_label 
            ORDER BY date_label ASC 
            LIMIT ${limit}
        `;
    } else {
        trendQuery = await sql`
            SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date_label, AVG(bmi_value) as avg_bmi 
            FROM bmi_records 
            GROUP BY date_label 
            ORDER BY date_label ASC 
            LIMIT ${limit}
        `;
    }

    const trends = trendQuery.rows;

    return NextResponse.json({
      metrics: {
        totalUsers: parseInt(totalUsersRows[0].count),
        avgBMI: avgBMIRows[0].avg ? parseFloat(avgBMIRows[0].avg).toFixed(2) : 0,
        obesityRate: obesityRate.toFixed(1),
      },
      distribution: [
        parseInt(underweightRows[0].count),
        parseInt(normalRows[0].count),
        parseInt(overweightRows[0].count),
        parseInt(obeseRows[0].count),
      ],
      trends,
    }, { status: 200 });

  } catch (error) {
    console.error('MIS Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
