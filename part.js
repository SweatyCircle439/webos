const nodeDiskInfo = require('node-disk-info');

// sync way
try {
    const disks = nodeDiskInfo.getDiskInfoSync();
    printResults('SYNC WAY', disks);
} catch (e) {
    console.error(e);
}

function bytesToAmount(/** @type {Number} */ bytes, full = false) {
    if (bytes > 1208925819614629174706176n) {
        if (full) {
            return `${bytes / 1208925819614629174706176n} yottabytes`;
        } else {
            return `${bytes / 1208925819614629174706176n} YB`;
        }
    }else if (bytes >= 1180591620717411303424n) {
        if (full) {
            return `${bytes / 1180591620717411303424n} zettabytes`;
        } else {
            return `${bytes / 1180591620717411303424n} ZB`;
        }
    }else if (bytes >= 1152921504606846976n) {
        if (full) {
            return `${bytes / 1152921504606846976n} exabytes`;
        } else {
            return `${bytes / 1152921504606846976n} EB`;
        }
    }else if(bytes >= 1125899906842624) {
        if (full) {
            return `${bytes / 1125899906842624} petabytes`;
        } else {
            return `${bytes / 1125899906842624} PB`;
        }
    }else if (bytes >= 1099511627776) {
        if (full) {
            return `${bytes / 1099511627776} terabytes`;
        } else {
            return `${bytes / 1099511627776} TB`;
        }
    }else if(bytes >= 1073741824) {
        if (full) {
            return `${bytes / 1073741824} gigabytes`;
        } else {
            return `${bytes / 1073741824} GB`;
        }
    }else if(bytes >= 1048576) {
        if (full) {
            return `${bytes / 1048576} megabytes`;
        } else {
            return `${bytes / 1048576} MB`;
        }
    }else if (bytes >= 1024) {
        if (full) {
            return `${bytes / 1024} kilobytes`;
        } else {
            return `${bytes / 1024} KB`;
        }
    }else if (bytes >= 1) {
        if (full) {
            return `${bytes / 1} bytes`;
        } else {
            return `${bytes} B`;
        }
    }else {
        if (full) {
            return `${bytes / 8} bits`
        }else {
            return `${bytes * 8} bit`;
        }
    }
}

function printResults(title, disks) {

    console.log(`============ ${title} ==============\n`);

    for (const disk of disks) {
        console.log('Filesystem:', disk.filesystem);
        console.log('size:', bytesToAmount(disk.blocks));
        console.log('Used:',  bytesToAmount(disk.used));
        console.log('Available:',  bytesToAmount(disk.available));
        console.log('Capacity:', disk.capacity);
        console.log('Mounted:', disk.mounted, '\n');
    }

}

const drivelist = require('drivelist');

async function main() {
    const drives = await drivelist.list();
    for (const drive of drives) {
        console.log(drive);
    }
}

main();