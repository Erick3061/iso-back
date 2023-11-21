import { Injectable } from "@nestjs/common";

interface DeleteRepeat<T> {
    data: Array<T>;
    Alarm: keyof T;
    Event: 'SRS' | 'STA'
}

@Injectable()
export class Filters {
    deleteRepeat<T extends Object>({ data, Alarm, Event }: DeleteRepeat<T>) {
        let ban: boolean = false;
        return data.filter(event => {
            if (!ban && event[Alarm] === Event) {
                ban = true;
                return event;
            } else {
                if (event[Alarm] !== Event) {
                    ban = false;
                    return event;
                }
            }
        });
    }

    getMinutes(time: number) {
        const s = Math.floor((time) / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        const hours = Math.floor(h);
        const minutes = Math.floor(m - (h * 60));
        // const seconds = Math.floor(s - (((m === 0) ? 1 : m * 60) * ((h === 0) ? 1 : h))) + 1;
        return { minutes: ((hours * 59) + minutes) }
    }
}