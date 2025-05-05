// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const { email, name } = await request.json();

  if (!email?.trim() || !name?.trim()) {
    return NextResponse.json(
      { error: 'Email dan nama wajib diisi.' },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();
  try {
    // Cek apakah email sudah ada
    const [rows]: any[] = await conn.execute(
      `SELECT COUNT(*) as count FROM data WHERE email = ? AND name = ?`,
      [email, name]
    );
    if (rows[0].count > 0) {
      return NextResponse.json(
        { error: 'Data sudah ada.' },
        { status: 409 }
      );
    }

    // Jika belum ada, lakukan insert
    await conn.execute(
      `INSERT INTO data (email, name) VALUES (?, ?)`,
      [email, name]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error('DB ERROR:', err);
    // Jika unique-index violation ter-trigger:
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Data sudah ada.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal menyimpan data.' },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
