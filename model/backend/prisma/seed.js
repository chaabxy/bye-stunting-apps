const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const sql = fs.readFileSync('prisma/02-insert-education-conclusions.sql', 'utf8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(sql)
  .then(() => {
    console.log('✅ Seeding selesai!');
    pool.end();
  })
  .catch((err) => {
    console.error('❌ Gagal seeding:', err);
    pool.end();
  });
