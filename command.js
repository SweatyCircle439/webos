const { spawn } = require("child_process");
function run(/** @type {String} */ command){
    const options = command.split(" ");
    const rcommand = options.shift();
    const proc = spawn(rcommand, options);
    proc.stdout.on("data", (data) => {
        console.log(data.toString());
    });
    proc.stderr.on("data", (data) => {
        console.log(data.toString());
    });
    proc.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
module.exports = run;