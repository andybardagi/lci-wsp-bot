import { Client } from "whatsapp-web.js";
import { SendMessageConfig } from "./types/Message";

export const sendMessage = async (client: Client, data: SendMessageConfig) => {
  try {
    const { message, destination } = data;
    // TODO: Validate destination
    await client.sendMessage(destination, message);
  } catch (error) {
    //console.error(error);
    return {
      success: false,
      message: "Error enviando el mensaje",
    };
  }
};
