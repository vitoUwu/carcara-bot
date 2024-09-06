interface Embed {
  title?: string;
  description?: string;
  /**
   * @format color-input
   * @default #2b2d31
   */
  color?: string;
}

interface Message {
  content?: string;
  embeds?: Embed[];
}

interface Props {
  /**
   * @title Webhook URL
   */
  webhookURL: string;
  message: Message;
}

/**
 * @title Webhook Message
 */
export type WebhookMessage = Props;

export default function loader(props: Props): WebhookMessage {
  return props;
}
