import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qhfsvhamwddwlahahpdi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZnN2aGFtd2Rkd2xhaGFocGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzM1MjAsImV4cCI6MjA2Nzg0OTUyMH0.kMVStJkrcFVrYW-CW8Wg5rKGmyj-33XRjQ9t1-6ksRU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { userId, username, score } = req.body;
    if (!userId || !username || score == null) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const { error } = await supabase
      .from('leaderboard')
      .upsert({ user_id: userId, username, score });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Saved' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
