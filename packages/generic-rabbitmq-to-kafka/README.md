# Generic RabbitMQ to Kafka plugin

Processing: this plugin listens to RabbitMQ queues and acts as a pass between RabbitMQ and Kafka. For each RabbitMQ message consumed, it will produce an associated Kafka message, which can then be consumed by other applications. RabbitMQ queues and Kafka topics have the same name so that no configuration is needed and a Kafka key is created using multiple attributes from the RabbitMQ message.

### Environment variables

This plugin requires the addition of environment variables to be able to work.

| Variable name                     | Required | Prefixed | Description                                                      | Default value |
| --------------------------------- | -------- | -------- | ---------------------------------------------------------------- | ------------- |
| PLUGIN_NAME                       | *        | *        | Plugin Name                                                      |               |
| PLUGIN_VERSION                    | *        | *        | Plugin Version                                                   |               |
| STREAM                            | *        | *        | Name of the Business Term to handle                              |               |
| KAFKA_KEY_ATTRIBUTES                            | *        | *        | Attributes in RabbitMQ message used to create kafka key                              |               |
| RABBITMQ_QUEUES                            | *        | *        | List of RabbitMQ queues names                             |               |
| RABBITMQ_CONTENT_TYPES                            | *        | *        | List of RabbitMQ content types for queues                                |               |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
