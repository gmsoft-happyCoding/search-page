// require modules
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const archiver = require('archiver');

/**
 * 在当前项目根目录生产打包文件
 * @param {string} source
 * @param {string} zipFileName
 */
function zip(source, zipFileName = 'build') {
  const projectRoot = process.cwd();
  const isMono = projectRoot.includes('packages');
  const projectName = path.basename(projectRoot);
  const dest = isMono ? path.join(projectRoot, '../..') : projectRoot;
  const fileName = isMono ? `${projectName}-${zipFileName}` : zipFileName;
  const outputFile = path.format({ dir: dest, name: fileName, ext: '.zip' });

  // create a file to stream archive data to.
  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function() {
    console.log();
    console.log(
      chalk.yellow(`${outputFile} 文件生成完毕(${Math.ceil(archive.pointer() / 1024)}Kb)!`)
    );
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.log('err');
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  // append files from a sub-directory, putting its contents at the root of archive
  archive.directory(source, false);

  // finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
  archive.finalize();
}

module.exports = zip;
