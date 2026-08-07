import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres:YOUR_PASSWORD@db.aiesfwtfkwacrggenvdu.supabase.co:5432/postgres'
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}

test();
