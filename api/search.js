export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query parameter 'q'" });

  try {
    const targetUrl = `https://www.bing.com/images/async?q=${encodeURIComponent(q + ' NBA basketball')}&first=1&count=25`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ success: false, error: `HTTP ${response.status}` });
    }

    const text = await response.text();
    const rawMatches = text.match(/murl&quot;:&quot;(http[^&]+)&quot;/gi) || text.match(/"murl":"(http[^"]+)"/gi) || [];
    
    const images = rawMatches.map(m => {
      return m.replace(/murl&quot;:&quot;/gi, '')
              .replace(/"murl":"/gi, '')
              .replace(/&quot;/gi, '')
              .replace(/"/gi, '');
    }).filter(url => url.startsWith('http'));

    const uniqueImages = [...new Set(images)];
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, count: uniqueImages.length, images: uniqueImages.slice(0, 25) });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: err.message });
  }
}
