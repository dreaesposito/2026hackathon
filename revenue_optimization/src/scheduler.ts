import { Ad, Area, Schedule, ScheduledAd, PlacementEngine } from './placementEngine';
import { RevenueEngine } from './revenueEngine';

export class Scheduler {
    placementEngine: PlacementEngine;
    revenueEngine: RevenueEngine;

    constructor(placementEngine: PlacementEngine, revenueEngine: RevenueEngine) {
        this.placementEngine = placementEngine;
        this.revenueEngine = revenueEngine;
    }

    getNextAvailableStartTime(areaSchedule: ScheduledAd[]): number {
        if (areaSchedule.length === 0) {
            return 0;
        }

        areaSchedule.forEach(ad => {
            // one ad starts later than 0
            if (ad.startTime == 0) {
                return ad.endTime;
            }
        })

        // const max = Math.max(...areaSchedule.map(ad => ad.endTime));

        // return max > 0 ? 0 : max;

        return Math.max(...areaSchedule.map(ad => ad.endTime));
    }

    isValidSchedule(
        schedule: Schedule,
        areas: Area[],
        ads: Ad[]
    ): boolean {
        return false;
    }

    compareSchedules(
        ads: Ad[],
        areas: Area[],
        scheduleA: Schedule,
        scheduleB: Schedule,
        decayRate: number
    ): number {
        return 0;
    }

    buildSchedule(
        ads: Ad[],
        areas: Area[],
        decayRate: number
    ): Schedule {
        return {};
    }
}
