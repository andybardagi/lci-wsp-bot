import { Client } from "whatsapp-web.js";
import { SendMessageConfig } from "./types/Message";

export const sendMessage = async (client: Client, data: SendMessageConfig) => {
  try {
    // Delay between messages (1-2 seconds) -> Avoids being blocked by Whatsapp
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const { message, destination } = data;
    
    // TODO: Validate destination
    await client.sendMessage(destination, message);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
export const replaceMessageVariables = (
  message: string,
  variables: Record<string, unknown>
): string => {
  let newMessage = message;
  Object.entries(variables).forEach(([key, value]) => {
    newMessage = newMessage.replaceAll(`{{${key}}}`, String(value));
  });
  return newMessage;
}