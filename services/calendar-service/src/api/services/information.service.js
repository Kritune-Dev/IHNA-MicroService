const packageInformation = require('../../../package.json')

exports.packageParseInformation = (req) => {
  const uptime = getUptime()
  const revision = getGitCommit()
  return {
    message: 'OK',
    timestamp: new Date().toISOString(),
    name: packageInformation.name,
    version: packageInformation.version,
    uptime: uptime,
    revision: revision,
    IP: req.ip,
    URL: req.originalUrl
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.toHHMMSS = function () {
  const secNum = parseInt(this, 10) // don't forget the second param
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  const time = hours + ':' + minutes + ':' + seconds
  return time
}

function getUptime () {
  const time = process.uptime()
  const uptime = (time + '').toHHMMSS()
  return uptime
}

function getGitCommit () {
  const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()
  return revision
}
