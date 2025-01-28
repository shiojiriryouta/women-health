import mysql from 'mysql2/promise';
import 'dotenv/config';

export async function POST(req) {
  const { line_id, date, mealType, mealData } = await req.json();

  // MySQL接続設定
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // usersテーブルから対応するuser_idを取得
    const [rows] = await connection.execute(
      `SELECT id FROM users WHERE line_id = ?`,
      [line_id]
    );

    if (rows.length === 0) {
      connection.end();
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user_id = rows[0].id;
    const meal_json = [mealData]
    // health_dataテーブルにデータを更新または挿入
    const query = `
      INSERT INTO health_data (user_id, date, ${mealType})
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE ${mealType} = VALUES(${mealType})
    `;

    await connection.execute(query, [user_id, date, JSON.stringify(meal_json)]);

    connection.end();
    return new Response(JSON.stringify({ message: 'Meal data updated successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    connection.end();
    return new Response(JSON.stringify({ message: 'Error updating meal data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
