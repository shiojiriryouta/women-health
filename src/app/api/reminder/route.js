import mysql from 'mysql2/promise';
import 'dotenv/config';

export async function POST(req) {
  try {
    const { line_id, remindData } = await req.json();

    // MySQL接続設定
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, // 環境変数から取得
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // データ挿入 or 更新
    await connection.execute(
      `INSERT INTO users (line_id, notification)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      notification = VALUES(notification)`,
      [line_id, remindData]
    );

    // 接続を閉じる
    connection.end();

    return new Response(JSON.stringify({ message: 'リマインダー設定が更新されました！' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'データ保存中にエラーが発生しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
