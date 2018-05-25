const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const Hexo = require('hexo');
const simpleGit = require('simple-git');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());

const contentDir = path.join(__dirname, 'www');
const themeDir = path.join(__dirname, 'www', 'pl', 'themes', 'www-theme');

const baseDir = path.join(__dirname, 'www', 'pl');
const buildDir = path.join(__dirname, 'www', 'build', 'pl');


const options = {
  config: '_prod-config.yml',
  debug: true,
};

const hexo = new Hexo(baseDir, options);
hexo.init();

const pull = dir =>
  new Promise((resolve) => {
    const git = simpleGit(dir).silent(false);

    console.log('--[Pulling]--', dir)

    git.pull('origin', 'master', () =>
      git.reset(['--hard', 'FETCH_HEAD'], resolve)
    )
  })


const rebuild = () => {
    pull(contentDir)
      .then(() => pull(themeDir))
      .then(() => {
        hexo
          .call('generate', { force: true })
          .catch((e) => console.error(e));
      })
  };


app.post('/regenerate', (req, res) => {
  if (config.key === req.query.key) {
    rebuild()
    res.send('Success');
  } else {
    res.send('ok');
  }
});


app.use('/', express.static(buildDir));

const port = config.port || 80;
app.listen(port, () => console.log('Running server on port:', port));
