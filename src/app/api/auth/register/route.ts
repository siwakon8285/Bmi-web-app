import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Check if user exists
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (rows.length > 0) {
      return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    // Postgres uses RETURNING id to get the inserted ID, unlike SQLite's lastInsertRowid
    const result = await sql`
      INSERT INTO users (username, password_hash) 
      VALUES (${username}, ${hashedPassword}) 
      RETURNING id
    `;
    
    const userId = result.rows[0].id;

    return NextResponse.json({ message: 'User registered successfully', userId }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
