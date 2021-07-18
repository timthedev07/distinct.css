"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs"));
const parser = yargs_1.default(process.argv.slice(2)).options({
    f: { type: "string" },
});
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const INVALID_PATH = `Please provide a valid directory/file path.\nType ${CYAN}\`distinct.css -h\`${RESET} for help.\n`;
(async () => {
    const argv = await parser.argv;
    const path = argv.f;
    if (!path)
        return console.error(INVALID_PATH);
    // checking if the path is a file or a directory
    let type = "file";
    try {
        type = fs_1.lstatSync(path).isDirectory() ? "dir" : "file";
    }
    catch (err) {
        console.error(INVALID_PATH, err);
    }
    if (type === "dir") {
        const files = await fs_1.promises.readdir(path);
        files.forEach((each) => {
            console.log(each);
        });
    }
})();
