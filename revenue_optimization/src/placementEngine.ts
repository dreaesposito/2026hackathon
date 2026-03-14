export interface Ad {
    adId: string;
    advertiserId: string;
    timeReceived: number;
    timeout: number;
    duration: number;
    baseRevenue: number;
    bannedLocations: string[];
}

export interface Area {
    areaId: string;
    location: string;
    multiplier: number;
    totalScreens: number;
    timeWindow: number;
}

export interface ScheduledAd {
    adId: string;
    areaId: string;
    startTime: number;
    endTime: number;
}

export type Schedule = Record<string, ScheduledAd[]>;

export class PlacementEngine {

    constructor() {
    }

    isAdCompatibleWithArea(ad: Ad, area: Area): boolean {
        return !ad.bannedLocations.includes(area.location);
    }

    getTotalScheduledTimeForArea(areaSchedule: ScheduledAd[]): number {
        return areaSchedule.reduce((acc, ad) => {
            return acc + (ad.endTime -  ad.startTime);
        }, 0);
    }

    doesPlacementFitTimingConstraints(
        ad: Ad,
        area: Area,
        startTime: number
    ): boolean {
        if (startTime >= area.timeWindow) {
            return false;
        } else if (ad.timeReceived > startTime){
            return false;
        } else if ((ad.timeReceived + ad.timeout) < startTime) {
            return false;
        } else if (ad.timeReceived > ad.timeout) {
            return false;
        } else if (startTime + ad.duration > area.timeWindow) {
            return false;
        } else {
            return true;
        }
    }

    isAdAlreadyScheduled(adId: string, schedule: Schedule): boolean {
        return Object.values(schedule).some(ads => {
            return ads.some(ad => {
                return ad.adId === adId
            });
        });
    }

    canScheduleAd(
        ad: Ad,
        area: Area,
        schedule: Schedule,
        startTime: number
    ): boolean {
        if (!this.isAdCompatibleWithArea(ad, area)) {
            return false
        } else if (this.isAdAlreadyScheduled(ad.adId, schedule)) {
            return false;
        } else if (!this.newAdDoesNotOverlap(schedule, ad, area, startTime)) {
            return false;
        } else if (!this.doesPlacementFitTimingConstraints(ad, area, startTime)) {
            return false;
        } else {
            return true;
        }
    }

    newAdDoesNotOverlap(
        schedule: Schedule,
        ad: Ad,
        area: Area,
        startTime: number
    ): boolean {
        const endTime = startTime + ad.duration;
        const scheduledAds = schedule[area.areaId] ?? [];

        return !scheduledAds.some(existing =>
            startTime < existing.endTime &&
            endTime > existing.startTime
        );
    }

    // Two ads in the same area do not overlap if the 
    // first has endTime: E and the next has startTime >= E 
    // (touching boundaries are valid).
    overlappingSchedule(schedule: Schedule, ad: Ad): boolean {
        for (const ads of Object.values(schedule)) {
            for (let i = 0; i < ads.length - 1; i++) {
                const current = ads[i];
                const next = ads[i + 1];

                const overlaps = current.endTime > next.startTime;

                if (overlaps) {
                    return true;
                }
            }
        }

        return false;
    }


    isAreaScheduleValid(
        area: Area,
        areaSchedule: ScheduledAd[],
        ads: Ad[]
    ): boolean {
        const adsById = new Map(ads.map(ad => [ad.adId, ad]));

        for (const scheduled of areaSchedule) {
            const ad = adsById.get(scheduled.adId);

            // scheduled ad must exist in ads list
            if (!ad) {
                return false;
            }

            // scheduled ad should belong to this area
            if (scheduled.areaId !== area.areaId) {
                return false;
            }

            // banned location check
            if (ad.bannedLocations.includes(area.location)) {
                return false;
            }

            // timing must be valid
            if (scheduled.startTime < 0) {
                return false;
            }

            if (scheduled.endTime <= scheduled.startTime) {
                return false;
            }

            if (scheduled.endTime > area.timeWindow) {
                return false;
            }

            // scheduled duration must match ad duration
            if (scheduled.endTime - scheduled.startTime !== ad.duration) {
                return false;
            }
        }

        const sortedSchedule = [...areaSchedule].sort(
            (a, b) => a.startTime - b.startTime
        );

        for (let i = 0; i < sortedSchedule.length - 1; i++) {
            const current = sortedSchedule[i];
            const next = sortedSchedule[i + 1];

            // touching boundaries is valid, overlap is not
            if (current.endTime > next.startTime) {
                return false;
            }
        }

        return true;
    }

}