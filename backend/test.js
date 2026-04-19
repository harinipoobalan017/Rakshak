const db = require('./config/db');

async function testDB() {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log("✅ DB Connected Successfully", rows);
  } catch (err) {
    console.error("❌ DB Connection Failed", err.message);
  }
}

testDB();