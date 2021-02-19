import Discord from "discord.js";
import { Module } from "module";
import safeEval from "safe-eval";
import { Script } from "vm";
import { Model } from "./Model";
import Program from "./Program";

const client = new Discord.Client();
require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}$`);
});

client.on("message", (msg) => {
    if (msg.content.startsWith("$")) {
        const chunks = msg.content.split(" ");
        const command = chunks.shift();
        switch (command) {
            case "$help":
                help(msg, chunks);
                break;
            case "$run":
                run(msg, chunks);
                break;
            case "$library":
                library(msg, chunks);
                break;
            case "$saveScript":
                saveScript(msg, chunks);
                break;
            case "$script":
                script(msg, chunks);
                break;
            case "$source":
                source(msg, chunks)
                break;
            default:
                msg.reply("Unknown command");
        }
    }
});

function help(msg: Discord.Message, chunks: Array<string>) {
    msg.reply(`
        You have following commands available 
        * $help - Will display all available commands
        * $run {code} - Will run the code, you can run code inside code blocks
        * $saveScript {name} {code} - Will start saving a script, you will be asked for name, you have following flags available -p --public -sg --severGlobal
        * $library - Will display available scripts you have stored
        * $serverScripts - See all global script available
        * $subscribe {id} - Add script to your library - NOT IMPLEMENTED
        * $script {id} - Run a script by name or id - NOT IMPLEMENTED
        * $source {id} - See script source code
    `);
}


async function source(msg: Discord.Message, chunks:Array<string>){
    try{
        const id = Number(chunks.shift());
        const programObj = await Program.getSingleRowByFilter(new Program(id));
        
        msg.reply(`
\`\`\`javascript
${programObj.code}
\`\`\``);
    }
    catch (e) {
        msg.reply("An error occured");
        console.log("Error", e);
    }
}
async function saveScript(msg: Discord.Message, chunks: Array<string>) {
    try {
        const name = chunks.shift();
        const code = parseCodeInput(chunks.join(" "));
        const programObj = new Program(undefined, name, msg.author.id, code);
        await programObj.save();
        msg.reply("Script saved, run library to see all scripts available");
    } catch (e) {
        msg.reply("An error occured");
        console.log("Error", e);
    }
}
async function library(msg: Discord.Message, chunks: Array<string>) {
    try {
        let programs: Array<Program> = await Program.getManyRowsByFilter(
            new Program(undefined, undefined, msg.author.id)
        );
        console.log(programs);
        const formattedPrograms = programs.map((e) => {
            return `Name: ${e.name} Id: ${e.id}`;
        });
        msg.reply("\n" + formattedPrograms.join("\n"));
    } catch (e) {
        msg.reply("An error occured");
    }
}
function run(msg: Discord.Message, chunks: Array<string>) {
    executeCodeContainer(parseCodeInput(chunks.join(" ")), msg);
}

async function script(msg: Discord.Message, chunks: Array<string>) {
    try {
        if (!chunks.length) {
            msg.reply("No id");
            return;
        }
        const id = chunks.shift().trim();

        const script: Program = await Program.getSingleRowByFilter(
            new Program(Number(id))
        );

        executeCodeContainer(script.code, msg);
    } catch (e) {
        msg.reply("Error");
    }
}

function parseCodeInput(code: string): string {
    let codeStartIndex = code.search("```");
    if (codeStartIndex === -1) codeStartIndex = 0;
    let codeEnd = code.lastIndexOf("```");
    if (codeEnd === -1) codeEnd = undefined;
    else codeEnd -= 1;
    let filteredCode = code.substr(codeStartIndex, codeEnd);
    let lineBreak = filteredCode.search("\n");

    if (lineBreak !== -1) filteredCode = filteredCode.substr(lineBreak);
    return filteredCode;
}
function executeCodeContainer(code: string, msg: Discord.Message) {
    const returnMessages: Array<any> = [];
    const fakeConsoleLog = (message: any) => {
        returnMessages.push(message);
    };
    code = `
    (()=>{
        ${code}
    })();
    `;
    try {
        const result = safeEval(code, { console: { log: fakeConsoleLog } });
        msg.reply("\n" + returnMessages.join("\n"));
    } catch (e: any) {
        msg.reply("Error " + e.message);
    }
}

async function init() {
    console.log("start");
    await Model.startDatabaseConnection();
    client.login(process.env.TOKEN);
}
init();
