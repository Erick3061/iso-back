import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { DateDto, DateTimeDto } from 'src/common/dtos/index';
import { Auth } from 'src/auth/decorators';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('solicitud-sistema')
  @Auth()
  Srs_Sta(@Query() dateDto: DateDto) {
    return this.reportService.Srs_Sta(dateDto);
  }

  @Get('tecnico-en-sitio')
  @Auth()
  Tess_Tese(@Query() dateDto: DateDto) {
    return this.reportService.Tess_Tese(dateDto);
  }

  @Get('atencion')
  @Auth()
  At5ma(@Query() dateDto: DateDto) {
    return this.reportService.At5ma(dateDto);
  }

  @Get('at-operador')
  @Auth()
  AtOperator(@Query() dateTimeDto: DateTimeDto) {
    return this.reportService.AtOperator(dateTimeDto);
  }

  @Get('sistemas-instalados')
  @Auth()
  installerSystem() {
    return this.reportService.installerSystem();
  }

}
