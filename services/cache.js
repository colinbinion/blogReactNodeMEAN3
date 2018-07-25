const mongoose = require('mongoose');

// get ref to existing default .exec function defined on a mongoose query.
const exec = mongoose.Query.prototype.exec;

// overwrite and execute additional code when query is executed.
mongoose.Query.prototype.exec = function () {
  console.log('====================================');
  console.log('ABOUT TO RUN A QUERY');
  console.log('====================================');
  return exec.apply(this, arguments);
}
