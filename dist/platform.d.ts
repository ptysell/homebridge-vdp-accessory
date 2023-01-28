import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
export declare class vdpPlatform implements DynamicPlatformPlugin {
    readonly log: Logger;
    config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    readonly accessories: PlatformAccessory[];
    deviceCount: number;
    private periodicDiscovery;
    constructor(log: Logger, config: PlatformConfig, api: API);
    configureAccessory(accessory: PlatformAccessory): void;
    discoverDevices(): Promise<void>;
}
//# sourceMappingURL=platform.d.ts.map