import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './platformSettings';
import { vdpAccessory } from './platformAccessory';
import { platformDiscovery } from './platformDiscovery';
import type { platformDevice } from './types';

import fs from 'fs';

export class vdpPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  public readonly accessories: PlatformAccessory[] = [];
  public deviceCount = 0;
  private periodicDiscovery: NodeJS.Timeout | null = null;



  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('Finished initializing platform:', this.config.name);
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      this.discoverDevices();
      this.periodicDiscovery = setInterval(() => this.discoverDevices(), 50000);

    });
  }

  configureAccessories(accessory: PlatformAccessory[]) {
    this.log.info('Method: configureAccessories');
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  addAccessories(accessory: PlatformAccessory[]) {
    this.log.info('Method: registerAccessories');
  }

  addAccessory(accessory: PlatformAccessory) {
    this.log.info('Method: registerAccessory');
  }

  updateAccessories(accessory: PlatformAccessory[]) {
    this.log.info('Method: updateAccessories');
  }

  updateAccessory(accessory: PlatformAccessory) {
    this.log.info('Method: updateAccessory');
  }

  unregisterAccessories(accessory: PlatformAccessory[]) {
    this.log.info('Method: unregisterAccessories');
  }

  removeAccessory(accessory: PlatformAccessory) {
    this.log.info('Unregistering Platform Accessory:', accessory.displayName);
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    let index = 0;
    for (const device of this.accessories) {
      if (device.UUID === accessory.UUID){
        this.log.info('Removing Platform Accessory:', accessory.displayName);
        this.accessories.splice(index, 1);
      }
      index++;
    }
  }

  async pruneAccessories(deviceList: platformDevice[]){
    let index = 0;
    for (const device of this.accessories) {
      const existingAccessory = deviceList.find(accessory => accessory.uuid === device.UUID);
      if(!existingAccessory){
        this.log.info('Pruning Platform Accessory:', device.displayName, 'at index', index);
        const tmpAccessory = new this.api.platformAccessory(device.displayName, device.UUID);

        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [tmpAccessory]);
        this.accessories.splice(index, 1);
      }
      index++;
    }
  }

  async discoverDevices() {

    const pendingUpdate = new Set();
    const recentlyRegisteredDevices = new Set();

    const registeredDevices = 0;
    const newDevices = 0;
    const unseenDevices = 0;
    const scans = 0;

    const platformDiscoverer = new platformDiscovery(this.log, this.config, this.api);

    const deviceList: platformDevice[] = await platformDiscoverer.scan(2000);
    this.pruneAccessories(deviceList);

    this.log.error('Config Accessory Count:', deviceList.length);
    this.log.error('Platform Accessory Count:', this.accessories.length);

    for (const device of deviceList) {
      const name = device.name;
      //const uuid = device.uuid;
      const uuid = this.api.hap.uuid.generate(device.displayName);
      const displayName = device.displayName;
      let isExisting = '';

      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if(existingAccessory){
        isExisting = 'Yes';
      } else{
        isExisting='No';
      }



      this.log.error('---------------------------------');
      this.log.error('---------------------------------');
      this.log.debug('Device Name:', name);
      this.log.error('Device UUID:', uuid);
      this.log.info('Device Display Name:', displayName);
      this.log.warn('Device Cached:', isExisting);
      this.log.error('---------------------------------');

      if(existingAccessory){
        this.log.error('Found Existing Platform Accessory');
      } else{

        this.log.error('Registering New Platform Accessory');
        const accessory = new this.api.platformAccessory(device.displayName, uuid);
        accessory.context.device = device;
        new vdpAccessory(this, accessory);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        this.log.error('Push New Platform Accessory');
        this.accessories.push(accessory);


      }
    }


  }




}