import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export const getWspClient = async () => { 
  const client = new Client({});

  client.on("qr", (qr) => {
    // Display QR code in terminal
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Whatsapp está listo para ser utilizado!");
  });

  await client.initialize();

  return client;
};
