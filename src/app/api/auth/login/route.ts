import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const sessionData = { 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    
    const token = await encrypt(sessionData);

    const response = NextResponse.json({ message: 'Login successful', user: sessionData.user });
    
    response.cookies.set('session', token, { 
      httpOnly: true, 
      expires: sessionData.expires,
      path: '/' 
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
