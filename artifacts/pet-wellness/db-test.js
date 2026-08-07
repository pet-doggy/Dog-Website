import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres.aiesfwtfkwacrggenvdu:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
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
