const http = require('http');
const url = 'http://localhost:3001/paket-wisata';
http.get(url, (res) => {
  let data = '';
  console.log('statusCode', res.statusCode);
  res.on('data', (chunk) => data += chunk.toString());
  res.on('end', () => {
    console.log('body:', data.slice(0, 800));
  });
}).on('error', (err) => console.log('ERR', err.message));
