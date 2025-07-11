import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch leaderboard data sorted by score descending
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Update or insert player score
    const { userId, username, score } = req.body;

    if (!userId || !username || score == null) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    const { error } = await supabase
      .from('leaderboard')
      .upsert({ user_id: userId, username, score });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Saved' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
