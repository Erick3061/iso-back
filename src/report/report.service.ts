import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DateDto } from 'src/common/dtos/index';
import { ServiceWmService } from 'src/services/service-wm/service-wm.service';
import { srssta, tesstese, at5ma } from './constants/reports.constant';

@Injectable()
export class ReportService {

  constructor(
    private readonly serviceWmService: ServiceWmService
  ) { }

  async Srs_Sta({ start, end }: DateDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithOutAccounts({
        dateStart: start,
        dateEnd: end,
        filters: srssta
      });

      return { data }
    } catch (error) {
      this.handleError(error)
    }
  }

  async Tess_Tese({ start, end }: DateDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithOutAccounts({
        dateStart: start,
        dateEnd: end,
        filters: tesstese
      });

      return { data }
    } catch (error) {
      this.handleError(error)
    }
  }

  async At5ma({ start, end }: DateDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithOutAccounts({
        dateStart: start,
        dateEnd: end,
        filters: at5ma,
      });

      return { data }
    } catch (error) {
      this.handleError(error)
    }
  }

  async installerSystem() {
    try {
      const { accounts } = await this.serviceWmService.searchAccounts({
        includePanel: true,
      });
      return { accounts }
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    throw new InternalServerErrorException(error);
  }

}
