import { Module } from '@nestjs/common';
import { ClientProxyFactory } from "@nestjs/microservices";
import { } from "@grpc/proto-loader";
import { grpcClientOptions } from './grpc.client.options';

@Module({
    providers: [
        {
            provide: 'DB_SERVICE',
            useFactory: () => {
                return ClientProxyFactory.create(grpcClientOptions)
            }
        }
    ],
    exports: ['DB_SERVICE']
})
export class CommonModule { }
