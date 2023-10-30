import config from "@/config";
import amqplib from "amqplib";
import { uuid4 } from "uuid";

class RabitmqUtils {
  private connection: amqplib.Connection;

  public async getChannel() {
    if (!this.connection) {
      this.connection = await amqplib.connect(config.RABBITMQ_URL);
    }
    return await this.connection.createChannel();
  }

  public observer = async (RPC_QUEUE_NAME, action) => {
    const channel = await this.getChannel();
    await channel.assertQueue(RPC_QUEUE_NAME, {
      durable: false,
    });
    channel.prefetch(1);
    channel.consume(
      RPC_QUEUE_NAME,
      async (msg) => {
        if (msg.content) {
          const payload = JSON.parse(msg.content.toString());
          // DB Operation
          const response = await action(payload);

          channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
          });
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  };

  public requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
    const channel = await this.getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(requestPayload)), {
      replyTo: q.queue,
      correlationId: uuid,
    });

    return new Promise((resolve, reject) => {
      // timeout n
      const timeout = setTimeout(() => {
        channel.close();
        reject("timeout pass");
      }, 20000);
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  };

  public RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
    const uuid = uuid4(); // correlationId
    return await this.requestData(RPC_QUEUE_NAME, requestPayload, uuid);
  };

  public async PublishMessage(exchange, routingKey, msg) {
    const channel = await this.getChannel();
    channel.publish(exchange, routingKey, Buffer.from(msg));
  }
}

export default RabitmqUtils;
