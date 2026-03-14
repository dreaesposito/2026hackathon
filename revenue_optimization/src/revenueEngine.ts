import { Ad, Area, Schedule, ScheduledAd, PlacementEngine } from './placementEngine';

export class RevenueEngine {
    placementEngine: PlacementEngine;

    constructor(placementEngine: PlacementEngine) {
        this.placementEngine = placementEngine;
    }

    getAdvertiserScheduleCount(
        advertiserId: string,
        ads: Ad[],
        schedule: Schedule
    ): number {
        const advertiserAdIds = new Set(
            ads.filter(ad => ad.advertiserId === advertiserId)
                .map(ad => ad.adId)
        );

        let count = 0;

        Object.values(schedule).forEach(areaSchedule => {
            areaSchedule.forEach(scheduledAd => {
                if (advertiserAdIds.has(scheduledAd.adId)) {
                    count++;
                }
            });
        });

        return count;
    }

    //// ****
    calculateDiminishedRevenue(
        baseRevenue: number,
        advertiserScheduledCount: number,
        decayRate: number
    ): number {
        return baseRevenue * Math.pow(decayRate, advertiserScheduledCount);
    }

    calculatePlacementRevenue(
        ad: Ad,
        areas: Area[],
        ads: Ad[],
        schedule: Schedule,
        decayRate: number
    ): number {
        if (areas.length > 0){
            let area = areas[0];
            const advertiserScheduleCount = this.getAdvertiserScheduleCount(ad.advertiserId, ads, schedule);
            const diminshedRevenue = this.calculateDiminishedRevenue(ad.baseRevenue, advertiserScheduleCount, decayRate);
            return diminshedRevenue * area.multiplier;
        } else {
            return 0;
        }

    }

    getAdvertiserDiversity(ads: Ad[], schedule: Schedule): number {
        return 0;
    }

    getAreaRevenue(
        area: Area,
        areasArray: Area[],
        fullSchedule: Schedule,
        ads: Ad[],
        decayRate: number
    ): number {
        return 0;
    }
}