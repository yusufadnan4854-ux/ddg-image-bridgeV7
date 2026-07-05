export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query 'q'" });

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q + ' NBA basketball')}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ success: false, error: `DDG HTTP ${response.status}` });
    }

    const htmlText = await response.text();
    const imageRegex = /https?:\/\/[^\s"\'<>]+\.(?:jpg|jpeg|png)/gi;
    const matches = htmlText.match(imageRegex) || [];
    const uniqueMatches = [...new Set(matches)];

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, count: uniqueMatches.length, images: uniqueMatches.slice(0, 25) });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: err.message });
  }
}
