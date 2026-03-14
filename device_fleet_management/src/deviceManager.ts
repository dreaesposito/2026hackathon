export interface Device {
    id: string;
    name: string;
    version: string;
    user_id: string;
    status: 'active' | 'inactive';
    location: {
        latitude: number;
        longitude: number;
    };
}

export class DeviceManager {
    private devices: Map<string, Device>;
    private deviceCount: number;
    // constructor, gets called when a new instance of the class is created
    constructor() {
      this.devices = new Map<string,Device>();
      this.deviceCount = 0;
    }

    addDevice(device: Device): void {
      // invalid id
      if(device.id == null || device.id.length == 0)
        throw new Error('Device must have an id');
      
      // duplicate id
      if (this.devices.has(device.id))
        throw new Error('Device with id ' + device.id + ' already exists');

      this.devices.set(device.id, device);
      this.deviceCount++;
    }

    removeDevice(id: string): void {
      if(this.devices.delete(id))
        this.deviceCount--;
      else 
        throw new Error('Device with id ' + id + ' not found');
    }

    getDevice(id: string): Device | null {
      return this.devices.get(id) ?? null;
    }

    getDevicesByVersion(version: string): Device[] | null {
      let matches: Device[] = []; 

      this.devices.forEach(device => {
        if (device.version === version)
          matches.push(device);
      });

      return matches;
    }

    getDevicesByUserId(user_id: string): Device[] | null {
      let matches: Device[] = []; 

      this.devices.forEach(device => {
        if (device.user_id === user_id)
          matches.push(device);
      });

      return matches;
    }

    getDevicesByStatus(status: 'active' | 'inactive' | 'pending' | 'failed'): Device[] | null {
      let matches: Device[] = []; 

      this.devices.forEach(device => {
        if (device.status === status)
          matches.push(device);
      });

      return matches;
    }

    getDevicesInArea(latitude: number, longitude: number, radius_km: number): Device[] | null {
      let matches: Device[] = []; 

      this.devices.forEach(device => {
        const dist = this.haversineDistance(device.location, {latitude, longitude});

        if (dist <= radius_km)
          matches.push(device);
      });

      return matches;
    }

    getDevicesNearDevice(device_id: string, radius_km: number): Device[] | null {
      // returns all devices within a radius of the given device (not including the device itself)
      // the radius is in kilometers
      // return null;

      const referenceDevice = this.getDevice(device_id);
      if(referenceDevice == null)
        return null;

      let matches: Device[] = []; 

      this.devices.forEach(device => {
        if(device.id !== referenceDevice.id) {
          const dist = this.haversineDistance(device.location, referenceDevice.location);

          if (dist <= radius_km)
            matches.push(device);
        }
      });

      return matches;
    }

    getAllDevices(): Device[] {
        return [... this.devices.values()];
    }

    getDeviceCount(): number {
        return this.deviceCount;
    }

    private haversineDistance(pointA: Device["location"], pointB: Device["location"]): number {
        var radius = 6371; // km     

        //convert latitude and longitude to radians
        const deltaLatitude = (pointB.latitude - pointA.latitude) * Math.PI / 180;
        const deltaLongitude = (pointB.longitude - pointA.longitude) * Math.PI / 180;

        const halfChordLength = Math.cos(pointA.latitude * Math.PI / 180) * Math.cos(pointB.latitude * Math.PI / 180) 
        * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
        + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

        const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

        return radius * angularDistance;
    } 
}
