const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const Hexo = require('hexo');
const simpleGit = require('simple-git');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());

const projectDir = path.join(__dirname, 'www');
const baseDir = path.join(__dirname, 'www', 'pl');
const buildDir = path.join(__dirname, 'www', 'build', 'pl');

console.log(projectDir)
console.log(baseDir)
console.log(buildDir)

const options = {
  config: '_prod-config.yml',
  debug: true,
};

const hexo = new Hexo(baseDir, options);
hexo.init();

const git = simpleGit(projectDir);

const rebuild = () => git
  .silent(false)
  .pull('origin', 'master', () => {
    hexo
      .call('generate', {})
      .catch((e) => console.error(e));
  })


app.post('/regenerate', (req, res) => {
  if (config.key === req.body.key) {
    rebuild()
    res.send('Success');
  } else {
    res.send('ok');
  }
});

app.use('/', express.static(buildDir));

const port = config.port || 80;
app.listen(port, () => console.log('Running server on port:', port));
