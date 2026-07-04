import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email and password required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user. In the original PHP, new users have 'user' role.
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        // In the PHP code, is_verified isn't necessarily present in all DB schemas, 
        // but if we are adding verification, we could set a default. We'll stick to basic fields.
      })
      .select()
      .single();
      
    if (createError) {
      throw createError;
    }

    // We don't send the password back
    const { password: _, ...userWithoutPassword } = newUser;

    // The original PHP sends a verification email here, and returns success: true
    // For now we just return success
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
