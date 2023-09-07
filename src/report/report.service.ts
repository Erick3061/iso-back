import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SearchRequestGroup } from 'src/common/interfaces/groups/SearchRequestGroup';
import { DbServiceClient } from 'src/common/interfaces/db/DbService';
import { EmptyRequest } from 'src/common/interfaces/db/EmptyRequest';
import { AccountsRequest } from 'src/common/interfaces/accounts/AccountsRequest';
import { GroupRequestFilter } from 'src/common/interfaces/groups/GroupRequestFilter';
import { EventsGrouprequest } from 'src/common/interfaces/events/EventsGrouprequest';
import { EventsRequest } from 'src/common/interfaces/events/EventsRequest';
import { EventsWOAccountRequest } from 'src/common/interfaces/events/EventsWOAccountRequest';
import { LastEventRequest } from 'src/common/interfaces/events/LastEventRequest';
import { LastEventGroupRequest } from 'src/common/interfaces/events/LastEventGroupRequest';
import { AccountRequest } from 'src/common/interfaces/accounts/AccountRequest';

@Injectable()
export class ReportService implements OnModuleInit {

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


}
