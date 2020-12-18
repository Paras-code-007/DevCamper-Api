// no route/method return in http module see

const http = require('http');
const PORT = 4444;

const server = http.createServer((req, res) => {});

server.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`));
