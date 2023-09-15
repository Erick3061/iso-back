import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { grpcClientOptions } from './grpc.client.options';
import { ServiceWmService } from './service-wm.service';

@Module({
  providers: [
    {
      provide: 'DB_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create(grpcClientOptions)
      }
    },
    ServiceWmService
  ],
  exports: [ServiceWmService]
})
export class ServiceWmModule { }
