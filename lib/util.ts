import { execFile } from "child_process";
import { promisify } from "util";
import { join, extname } from "path";

const execute = promisify(execFile);

function getCommand(command: "cwebp" | "dwebp") {
    let platform: string;
    switch (process.platform) {
        case "win32":
            platform = "windows-x64";
            break;
        case "linux":
            platform = "linux-x86-64";
            break;
        case "darwin":
            platform = "mac-x86-64";
            break;
        default:
            throw new Error("Platform is not supported");
    }
    return join(__dirname, "../", "webp", platform, command);
}

function getOutputFilepath(imageFilepath: string) {
    const imageExtension = extname(imageFilepath);
    return imageFilepath.replace(imageExtension, ".webp");
}

export {
    execute,
    getCommand,
    getOutputFilepath
};