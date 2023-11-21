import { credentials } from '@grpc/grpc-js';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'db',
        protoPath: join(__dirname, './proto/main.proto'),
        url: "service-data.com:9000",
        credentials: credentials.createSsl(
            readFileSync(join(__dirname, './certs/ca.crt')),
            readFileSync(join(__dirname, './certs/client.key')),
            readFileSync(join(__dirname, './certs/client.crt'))
        ),
        maxReceiveMessageLength: 1024 * 1024 * 10
    },
};

