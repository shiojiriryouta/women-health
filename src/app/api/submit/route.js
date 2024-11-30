import mysql from 'mysql2/promise';
import 'dotenv/config';


export async function POST(req) {
  const { age, height, weight, line_id } = await req.json();

  // MySQL接続設定
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST, // 環境変数から取得
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // データ挿入クエリ
    await connection.execute(
      'INSERT INTO users (age, height, weight, line_id) VALUES (?, ?, ?, ?)',
      [age, height, weight, line_id]
    );

    connection.end();
    return new Response(JSON.stringify({ message: 'Data saved successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    connection.end();
    return new Response(JSON.stringify({ message: 'Error saving data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
