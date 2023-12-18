import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DbServiceClient } from './interfaces/db/DbService';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SearchRequestGroup } from './interfaces/groups/SearchRequestGroup';
import { EmptyRequest } from './interfaces/db/EmptyRequest';
import { AccountsRequest } from './interfaces/accounts/AccountsRequest';
import { GroupRequestFilter } from './interfaces/groups/GroupRequestFilter';
import { EventsGrouprequest } from './interfaces/events/EventsGrouprequest';
import { EventsRequest } from './interfaces/events/EventsRequest';
import { EventsWOAccountRequest } from './interfaces/events/EventsWOAccountRequest';
import { LastEventRequest } from './interfaces/events/LastEventRequest';
import { LastEventGroupRequest } from './interfaces/events/LastEventGroupRequest';
import { AccountRequest } from './interfaces/accounts/AccountRequest';

@Injectable()
export class ServiceWmService implements OnModuleInit {
    private DBSevice: DbServiceClient

    constructor(
        @Inject('DB_SERVICE')
        private readonly client: ClientGrpc
    ) { }

    onModuleInit() {
        this.DBSevice = this.client.getService<DbServiceClient>('DbService');
    }

    searchGroups(query: SearchRequestGroup) {
        return firstValueFrom(this.DBSevice.searchGroups(query));
    }

    testService(query: EmptyRequest) {
        return firstValueFrom(this.DBSevice.test(query));
    }

    searchAccounts(query: AccountsRequest) {
        return firstValueFrom(this.DBSevice.searchAccounts(query));
    }

    findOneAccount(query: AccountRequest) {
        return firstValueFrom(this.DBSevice.findOneAccount(query));
    }

    findOneGroup(query: GroupRequestFilter) {
        return firstValueFrom(this.DBSevice.findOneGroup(query));
    }
    getEventsFromGroup(query: EventsGrouprequest) {
        return firstValueFrom(this.DBSevice.getEventsFromGroup(query));
    }

    getEventsWithAccounts(query: EventsRequest) {
        return firstValueFrom(this.DBSevice.getEventsWithAccounts(query));
    }

    getEventsWithOutAccounts(query: EventsWOAccountRequest) {
        return firstValueFrom(this.DBSevice.getEventsWithOutAccounts(query));
    }

    getLasEventFromAccount(query: LastEventRequest) {
        return firstValueFrom(this.DBSevice.getLasEventFromAccount(query));
    }

    getLastEventFromGroup(query: LastEventGroupRequest) {
        return firstValueFrom(this.DBSevice.getLastEventFromGroup(query));
    }

    getCatalogueAlarms(query: EmptyRequest) {
        return firstValueFrom(this.DBSevice.getCatalogueAlarms(query));
    }

    getCatalogueEvents(query: EmptyRequest) {
        return firstValueFrom(this.DBSevice.getCatalogueEvents(query));
    }
}
