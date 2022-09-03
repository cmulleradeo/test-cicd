# ACL Metric Core


ACL Metric core gathers the different services allowing to communicate with tools such as GCP services or Kafka hosts on Confluent.
These services are injected to the plugins that need them.

## Core services
* PubSub: Real-time messaging service of Google Cloud
* GCS: Raw data storage service of Google Cloud
* KafkaJS: Real-time messaging service of Confluent
* MongoDB: NoSQL databases
* SQL: SQL databases (PostgreSQL, MySQL, etc)
* Events: Event based tool
* Logger: Logger service
* ErrorHandler: Errors service
* RabbitMQ: Consumes messages from RabbitMQ. 

## Changelog

https://github.com/adeo/metric-acl-monorepo/blob/main/CHANGELOG.md

## Global requirements and environment variables

Replace the environment variables:

### PubSub
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
| GOOGLE_APPLICATION_CREDENTIALS | * | Local path to google credentials | |

### GCS
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
| GOOGLE_APPLICATION_CREDENTIALS | * | Local path to google credentials | |

### KafkaJS
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
|KAFKA_HOST|  | Kafka host address ||
|KAFKA_REGISTRY|  | Kafka registry address ||
|KAFKA_SSL|  | Kafka ssl options ||
|KAFKA_SASL_MECHANISM|  | Kafka sasl mechanism ||
|KAFKA_SASL_USERNAME|  | Kafka username ||
|KAFKA_SASL_PASSWORD|  | Kafka password ||
|KAFKA_SESSION_TIMEOUT|  | Kafka session timeout (max. time between heartbeats) ||
|KAFKA_MAX_ASYNC_REQUESTS|  | Kafka max requests allowed | 10 |
|KAFKA_CONNECT_TIMEOUT|  | Kafka time before connection timeout | 5000 |
|KAFKA_REQUEST_TIMEOUT|  | Kafka time before request timeout | 10000 |
|KAFKA_CONNECT_RETRIES|  | Kafka number of connection retries | 3 |

### MongoDB
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
|MONGODB_HOST| * | Mongo database host address ||
|MONGODB_PORT| * | Mongo database host port ||
|MONGODB_NAME| * | Mongo database name ||
|MONGODB_USER| * | Mongo database user name ||
|MONGODB_PWD| * | Mongo database user password ||

### SQL
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
| DB_TYPE | * | Database type | |
| DB_USER | * | Database user | |
| DB_PWD | * | Database password | |
| DB_HOST | * | Database address | |
| DB_PORT | * | Database port | |
| DB_NAME | * | Database name | |

### Events
No global environment variables at the core level but to be set respectively on each plugin.

### Logger
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
| LOG_LEVEL | * | Minimum log level | info |
| ACL_TYPE | * | Type of ACL use to build ACL name | METRIC |
| PROJECT_TANGRAM | * | Tangram name of the product |  |
| BU_SHORT_NAME | * | BU code |  |
| NODE_ENV | * | Environment type |  |

### RabbitMQ
| Variable name | Required | Description | Default value |
| --------------|--------- | ----------- | ------------- |
| RABBITMQ_HOST | * | URL of the RabbitMQ broker |  |
| RABBITMQ_USER | * | RabbitMQ user's name |  |
| RABBITMQ_PASSWORD | * | RabbitMQ user's password |  |
| RABBITMQ_QUEUE | * | Name of the RabbitMQ queue to create or use |  |

## Contributing

