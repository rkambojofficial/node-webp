import { chmod } from "fs/promises";

import compress from "./compress";
import { getCommand } from "./util";

async function grantPermissions() {
    const cwebp = getCommand("cwebp");
    const dwebp = getCommand("dwebp");
    await chmod(cwebp, 0o755);
    await chmod(dwebp, 0o755);
}

grantPermissions();

export {
    compress
};
