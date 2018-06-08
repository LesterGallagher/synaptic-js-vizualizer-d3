const http = require('http');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { parse } = require('url');

function decodeQuery(url, discardEmpty) {
    url = url.split('?').slice(-1)[0];
    if (!url) return {};
    url = url.split('#')[0];
    var ret = {}, url, qKVP, qParts = url.split('&');
    for (var i = 0; i < qParts.length; i++) {
        qKVP = qParts[i].split('=');
        if (discardEmpty && (!qKVP[0] || !qKVP[1])) continue;
        ret[decodeURIComponent(qKVP[0])] = decodeURIComponent(qKVP[1]);
    }
    return ret;
}

const port = 1234;
const stdHeaders = {
    'Access-Control-Allow-Origin': '*',
};

const server = http.createServer((req, res) => {
    const url = parse(req.url);
    if (url.pathname === '/') return readFile('./index.html')
        .then(res.end.bind(res))
        .catch(res.end.bind(res));
    else if (url.pathname === '/api') {
        const query = decodeQuery(req.url);
        res.writeHead(200, stdHeaders);
        return readFile(query.name)
            .then(res.end.bind(res))
            .catch(res.end.bind(res))
    } // else
    res.writeHead(404, 'Not Found');
    res.end();
});

server.listen(port);
console.log(`listening to port ${port}`);


