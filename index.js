const { DisconnectReason, 
    useMultiFileAuthState 
} = require("@whiskeysockets/baileys");
//import { MessageType, MessageOptions, Mimetype } from '@whiskeysockets/baileys'
//import pkg from '@whiskeysockets/baileys';

const makeWASocket = require("@whiskeysockets/baileys").default;

async function connectionLogic(){

    const {state, saveCreds} = await useMultiFileAuthState("auth_info_baileys")
    const sock = makeWASocket({
        printQRInTerminal: true, 
        auth: state,
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if(qr){
            console.log(qr);
        }

        if(connection === "close"){
            const shouldReconnect = 
            lastDisconnect?.error?.output?.statusCode !==
            DisconnectReason.loggedOut;

        if(shouldReconnect){
            connectionLogic();
        }
        }
    });
  
    sock.ev.on('connection.update', function (update, connection2){
        let _a, _b;
        let connection = update.connection, lastDisconnect = update.lasDisconnect;
        if (connection == 'close'){
            if (((_b = (_a = lastDisconnect.error) === null
            || _a === void 0 ? void 0 : _a.output) === null
            || _b === void 0 ? void 0 : _b.statusCode) !== DisconnetReason.loggedOut) {
                connectionLogic();
            }
        } else {
            console.log('connection : '+JSON.stringify(connection));
        }
    });

   sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0];
        if(!msg.key.fromMe && m.type === 'notify'){
            //if(msg.key.remoteJid.includes('@s.whatsapp.net')){
                const sentMsg  = await sock.sendMessage(msg.key.remoteJid, { text: 'oh hello there' })
                
                const sections = [
                    {
                    title: "Section 1",
                    rows: [
                        {title: "Option 1", rowId: "opt1"},
                        {title: "Option 2", rowId: "opt2", description: "This is a description"}
                    ]
                    },
                   {
                    title: "Section 2",
                    rows: [
                        {title: "Option 3", rowId: "opt3"},
                        {title: "Option 4", rowId: "op4", description: "This is a description V2"}
                    ]
                    },
                ]
                
                const listMessage = {
                  text: "This is a list",
                  footer: "nice footer, link: https://google.com",
                  title: "Amazing boldfaced list title",
                  buttonText: "Required, text on the button to view the list",
                  sections
                }
                
             //const sentMsg = await sock.sendMessage(msg.key.remoteJid, listMessage)

                //send a template message!
            const templateButtons = [
             {index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
               {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+6289607524440'}},
                {index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
]
                const { MessageType, MessageOptions, Mimetype } = require("@whiskeysockets/baileys").default;
                const templateMessage = {
                    text: "Hi it's a template message",
                    footer: 'Hello World',
                    templateButtons: templateButtons
                }
                
              // const sendMsg = await sock.sendMessage(msg.key.remoteJid, templateMessage)

             // send a buttons message!
           
            const buttons = [
                {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
                {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
                {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
            ]
  
            const buttonMessage = {
                text: "Hi it's button message",
                footer: 'Hello World',
                buttons: buttons,
                headerType: 1
            }
  
              //const sendMsg = await sock.sendMessage(msg.key.remoteJid, buttonMessage);
            //}
        }
    });
}

connectionLogic();