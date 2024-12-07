module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Notion-Version, Authorization'
  );

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 从请求中获取目标 Notion API 路径
    const notionPath = req.url.replace('/api/notion', '');
    const notionApiUrl = `https://api.notion.com/v1${notionPath}`;

    // 转发请求到 Notion API
    const response = await fetch(notionApiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': req.headers['notion-version'] || '2022-06-28',
        'Authorization': req.headers.authorization
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 