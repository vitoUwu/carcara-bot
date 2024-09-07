import type { Props as EmbedProps } from "../components/Embed.tsx";

interface Message {
  /**
   * @title Content
   * @format textarea
   */
  content?: string;
  embeds?: EmbedProps[];
}

/**
 * @title Webhook Message
 */
interface Props {
  /**
   * @title Webhook URL
   */
  webhookURL: string;
  message: Message;
}

export type WebhookMessage = Props;

export default function loader(props: Props): WebhookMessage {
  return props;
}
