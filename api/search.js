export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query 'q'" });

  try {
    // যেকোনো স্পেসিফায়ার বাধ্যবাধকতা মুক্ত: যেই সংবাদের ছবি চাওয়া হবে সোজাসুজি শুধু তারই শতভাগ স্পোর্টস ফটো রিটার্ন করবে
    const targetUrl = `https://www.bing.com/images/async?q=${encodeURIComponent(q)}&first=1&count=25&scenario=ImageBasicHover`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ success: false, error: `Search HTTP ${response.status}` });
    }

    const htmlText = await response.text();
    const regex = /murl&quot;:&quot;(http[^&]+)&quot;/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(htmlText)) !== null) {
      matches.push(match[1]);
    }

    const uniqueMatches = [...new Set(matches)];

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, count: uniqueMatches.length, images: uniqueMatches.slice(0, 25) });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: err.message });
  }
}
