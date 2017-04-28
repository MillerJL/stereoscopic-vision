const exec = require('child_process').exec

function execPromise () {
  return new Promise((resolve, reject) => {
    exec('ffprobe -v error -show_format -show_streams -i ' + '/Users/johnmiller/School/capstone/test/videoStuff/video1.mp4', (e, stdout, stderr) => {
      if (stderr) reject(stderr)
      let out = stdout.toString('utf8')
      let matched = out.match(/duration="?(\d*\.\d*)"?/)

      resolve(parseFloat(matched[1]))
    })
  })
}

console.log('start')
execPromise().then(duration => {
  console.log(duration)
})
console.log('end')
