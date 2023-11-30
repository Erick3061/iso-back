import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DateDto, DateTimeDto } from 'src/common/dtos/index';
import { ServiceWmService } from 'src/services/service-wm/service-wm.service';
import { srssta, tesstese, at5ma, opat } from './constants/reports.constant';
import { Filters } from './helper/filters.heper';

@Injectable()
export class ReportService {

  constructor(
    private readonly serviceWmService: ServiceWmService,
    private readonly filtersHelpers: Filters
  ) { }

  async Srs_Sta({ start, end }: DateDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithAccounts({
        dateStart: start,
        dateEnd: end,
        filters: srssta,
        state: 'Activas'
      });

      let Data = data.filter(f => f.eventos);
      Data = Data.map(account => {
        const events = this.filtersHelpers.deleteRepeat({ data: this.filtersHelpers.deleteRepeat({ data: account.eventos, Alarm: 'CodigoAlarma', Event: 'SRS' }), Alarm: 'CodigoAlarma', Event: 'STA' });
        return { ...account, eventos: events }
      });

      let srs = [];
      let sta = [];
      let filters: Array<{ CodigoCte: string; CodigoAbonado: string; } & Pick<typeof Data[0], 'eventos'>> = [];

      Data.forEach(data => {
        const arrSrs = data.eventos.filter(f => f.CodigoAlarma === 'SRS');
        const arrSta = data.eventos.filter(f => f.CodigoAlarma === 'STA');

        if (arrSrs.length > 0) {
          arrSrs.map(event => {
            srs.push({ ...event, CodigoCte: data.CodigoCte, CodigoAbonado: data.CodigoAbonado })
          })
        }

        if (arrSta.length > 0) {
          arrSta.map(event => {
            sta.push({ ...event, CodigoCte: data.CodigoCte, CodigoAbonado: data.CodigoAbonado })
          })
        }

        if (data.eventos.length == 1 && data.eventos[0].CodigoAlarma === 'SRS') {
          data.eventos.map(event => {
            filters.push({ ...event, CodigoCte: data.CodigoCte, CodigoAbonado: data.CodigoAbonado })
          })
        } else {
          if (data.eventos.length !== 1) {
            let D = data.eventos;
            let CC = "";
            let ban: boolean = false;
            let BEA2: boolean = false;
            //Todo simplificar (se copio y pego del anterior)
            data.eventos.forEach((ev, idx) => {
              if (CC !== data.CodigoCte) {
                ban = false;
                BEA2 = false;
                if (ev.CodigoAlarma !== "STA") CC = data.CodigoCte;
              } else {
                if (ban === false && ev.CodigoAlarma === "STA") {
                  BEA2 = true;
                  if (BEA2 === true && CC === data.CodigoCte) D[idx - 1] = {};
                }
                if (ban === false && BEA2 === true && ev.CodigoAlarma === "SRS") BEA2 = false;
              }
            })

            if (D.filter(s => s.CodigoAlarma && s.CodigoAlarma !== 'STA').length > 0) {
              D.filter(s => s.CodigoAlarma && s.CodigoAlarma !== 'STA').map(event => {
                filters.push({ ...event, CodigoCte: data.CodigoCte, CodigoAbonado: data.CodigoAbonado })
              })
            }
          }
        }
      });

      return { srs, sta, pendingSrs: filters }
    } catch (error) {
      this.handleError(error)
    }
  }

  async Tess_Tese({ start, end }: DateDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithAccounts({
        dateStart: start,
        dateEnd: end,
        filters: tesstese,
        includeComments: true,
        state: 'Activas'
      });



      const events = data.filter(account => account.eventos).map(account => {
        const evs = account.eventos.map(ev => {
          const comment = account.comentarios.find(com => `${com.FechaEvento} ${com.HoraEvento}` === `${ev.FechaOriginal} ${ev.Hora}`);
          if (comment) {
            return { CodigoCte: account.CodigoCte, CodigoAbonado: account.CodigoAbonado, ...ev, Comment: comment.Comentario };
          }
        })
        return [...evs.filter(f => f)]
      }).flatMap(a => a);

      const tess = events.filter(el => el.CodigoAlarma === 'TESS' && (el.Comment.toLowerCase().includes('folio')) && (!el.Comment.toLowerCase().includes('sin folio')));
      const tese = events.filter(el => el.CodigoAlarma === 'TESE' && (el.Comment.toLowerCase().includes('tec')) || (el.Comment.toLowerCase().includes('téc') || ((el.Comment.toLowerCase().includes('sitio')) && (!el.Comment.toLowerCase().includes('tec'))) && el));

      return { tess, tese }
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
        order: 'DESC',
      });

      const events = data.map(event => {
        return { ...event, Minutes: this.filtersHelpers.getMinutes(new Date(`${event.FechaPrimeraToma}T${event.HoraPrimeraToma}.000Z`).getTime() - new Date(`${event.FechaOriginal}T${event.Hora}.000Z`).getTime()).minutes }
      });

      return { events }
    } catch (error) {
      this.handleError(error)
    }
  }

  async AtOperator({ start, end }: DateTimeDto) {
    try {

      const { data } = await this.serviceWmService.getEventsWithOutAccounts({
        dateStart: start.split(' ')[0],
        dateEnd: end.split(' ')[0],
        filters: opat,
        order: 'DESC',
      });

      const events = data.filter(event => {
        const timeEvent: number = new Date(`${event.FechaPrimeraToma}T${event.HoraPrimeraToma}.000Z`).getTime();
        const timeStart: number = new Date(`${`${start}`.replace(' ', 'T')}:00.000Z`).getTime();
        const timeEnd: number = new Date(`${`${end}`.replace(' ', 'T')}:00.000Z`).getTime();
        if (timeEvent >= timeStart && timeEvent <= timeEnd && event.ClaveMonitorista !== 'SYSTEM')
          return { ...event, Minutes: this.filtersHelpers.getMinutes(new Date(`${event.FechaPrimeraToma}T${event.HoraPrimeraToma}.000Z`).getTime() - new Date(`${event.FechaOriginal}T${event.Hora}.000Z`).getTime()).minutes }
      });

      const operators = [...new Set(events.map(event => event.ClaveMonitorista))].reduce((acc, current) => [...acc, { name: current, events: events.filter(event => event.ClaveMonitorista === current) }], []);

      return { totalEvents: events.length, operators }
    } catch (error) {
      this.handleError(error)
    }
  }

  async installerSystem() {
    try {
      const { accounts } = await this.serviceWmService.searchAccounts({
        includePanel: true,
        state: 'Activas'
      });
      return { accounts }
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.code === 2 && error.details.includes('Evento2021 NO EXISTE EN EL SERVIDOR')) {
      throw new BadRequestException('Year invalid');
    }
    throw new InternalServerErrorException(error);
  }

}
