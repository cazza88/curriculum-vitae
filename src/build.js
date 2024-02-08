const handlebars = require('handlebars');
const fs = require('fs-extra');
const markdownHelper = require('./utils/helpers/markdown');
const templateDataEN = require('./metadata/metadataEN');
const templateDataIT = require('./metadata/metadataIT');
const getSlug = require('speakingurl');
const dayjs = require('dayjs');
const repoName = require('git-repo-name');
const username = require('git-username');
const buildPdf = require('./utils/pdf.js');

const srcDir = __dirname;
const outputDir = __dirname + '/../dist';
const outputDirEN = __dirname + '/../dist/en';
const outputDirIT = __dirname + '/../dist/it';

// Clear dist dir
fs.emptyDirSync(outputDir);
fs.emptyDirSync(outputDirEN);
fs.emptyDirSync(outputDirIT);

// Copy root pages
fs.copySync(srcDir + '/pages', outputDir);

// Copy assets
fs.copySync(srcDir + '/assets', outputDirEN);
fs.copySync(srcDir + '/assets', outputDirIT);

// Build HTML EN
handlebars.registerHelper('markdown', markdownHelper);
const source = fs.readFileSync(srcDir + '/templates/index.html', 'utf-8');
const template = handlebars.compile(source);
var pdfFileName = `${getSlug(templateDataEN.name)}.pdf`;
const htmlEN = template({
  ...templateDataEN,
  baseUrl: `https://${username()}.github.io/${repoName.sync()}/en`,
  otherUrl: `https://${username()}.github.io/${repoName.sync()}/it`,
  pdfFileName,
  updated: dayjs().format('MMMM D, YYYY'),
});

pdfFileName = `${getSlug(templateDataIT.name)}.pdf`;

fs.writeFileSync(outputDirEN + '/index.html', htmlEN);

// Build PDF
buildPdf(`${outputDirEN}/index.html`, `${outputDirEN}/${pdfFileName}`);

// Build HTML IT
const htmlIT = template({
  ...templateDataIT,
  baseUrl: `https://${username()}.github.io/${repoName.sync()}/it`,
  otherUrl: `https://${username()}.github.io/${repoName.sync()}/en`,
  pdfFileName,
  updated: dayjs().format('DD/MM/YYYY'),
});

fs.writeFileSync(outputDirIT + '/index.html', htmlIT);

// Build PDF
buildPdf(`${outputDirIT}/index.html`, `${outputDirIT}/${pdfFileName}`);
