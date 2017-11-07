'use strict'

const ftpd = require('simple-ftpd')
const chalk = require('chalk')
const aws = require('aws-sdk');
const mongodb = require('mongodb');
const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: 'ca-central-1',
  accessKeyId: "",
  secretAccessKey: "",
})

ftpd({ host: '127.0.0.1', port: 1337, root: '/' }, (session) => {
  session.on('pass', (username, password, cb) => {
    if (username === 'superadmin' && password === '53cr3t') {
      cb(null, 'Welcome')
    } else {
      cb(new Error('Not authenticated'), 'Not authenticated')
    }
  })

  const file = {
    dev: 16777218,
    mode: 33188,
    nlink: 1,
    ino: 28875282,
    size: 31488,

  }

  const folder = {
    dev: 16777218,
    mode: 16877,
    nlink: 102,
    uid: 502,
    ino: 740953,
    size: 3468,
  }

  session.on('stat', (pathName, cb) => {
    cb(null, pathName === '/' ? folder : file)
  })

  session.on('readdir', (pathName, cb) => {
    cb(null, ['hello.jpg'])
  })

  session.on('read', (pathName, offset, cb) => {
    var params = {
      Bucket: "dev-bucket-cmg",
      Key: pathName,
     };
    cb(null, s3.getObject(params).createReadStream());
  })

});