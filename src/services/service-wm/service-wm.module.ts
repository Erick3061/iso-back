import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceWmService } from './service-wm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { readFileSync } from 'fs';
import { credentials } from '@grpc/grpc-js';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: 'DB_SERVICE',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: Transport.GRPC,
          options: {
            package: 'db',
            protoPath: join(__dirname, './proto/main.proto'),
            url: configService.get('URL_SERVICE'),
            credentials: credentials.createSsl(
              readFileSync(join(__dirname, './certs/ca.crt')),
              readFileSync(join(__dirname, './certs/client.key')),
              readFileSync(join(__dirname, './certs/client.crt'))
            ),
            maxReceiveMessageLength: 1024 * 1024 * 10
          },
        }
      }
    }])
  ],
  providers: [ServiceWmService],
  exports: [ServiceWmService]
})
export class ServiceWmModule { }
