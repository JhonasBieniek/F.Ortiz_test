const proxy = [
    {
      context: '/api',
      target: 'http://sis.sandrapelincer.com.br/users/token.json',
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = proxy;