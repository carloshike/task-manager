var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [
  {
    context: '/accounts',
    target: 'https://app.fluigidentity.com',
    secure: false,
    changeOrigin: true
  },
  {
    context: '/tasks',
    target: 'http://tasks-prod.k8s-platform-prod-us-east-1.fluig.io',
    secure: false,
    changeOrigin: true
  }
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);