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
  variables: Record<string, unknown>,
  isMessage01: boolean,
): string => {
  let newMessage = message;

  // Normalizamos las claves del objeto variables
  const normalizedVariables = Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [key.toLowerCase(), value])
  );
 

  // Reemplazamos las variables en el mensaje
  Object.entries(normalizedVariables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "gi"); // 'gi' para que sea insensible a mayúsculas/minúsculas
    newMessage = newMessage.replace(regex, String(value));
  });

  return newMessage;
};
