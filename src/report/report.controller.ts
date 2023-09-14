import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('getEvents')
  async tess() {
    try {
      const data = await this.reportService.searchGroups({
        groups: [{ id: 98, type: "Grupo" }],
        includeAccounts: true,
        includeContacts: true,
        includeDeviceZone: true,
        includeEmail: true,
        includeGeneralData: true,
        includePanel: true,
        includePartitions: true,
        includeSchedule: true,
        includeSecurity: true,
        includeUsers: true,
        includeZones: true,
      });
      return {
        ...data
      }
    } catch (error) {
      console.log(error);
    }
  }

}
