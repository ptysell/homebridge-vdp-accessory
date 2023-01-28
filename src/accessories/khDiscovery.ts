import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { vdpPlatform } from '../platform';
import {IPDiscovery} from 'hap-controller';



/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 *
 *
 *
 *

const { IPDiscovery } = require('hap-controller');

const discovery = new IPDiscovery();

discovery.on('serviceUp', (service) => {
    console.log('Found device:', service);
});

discovery.start();

*
 *
 *
 *
 *
 *
 *
 */
export class vdpAccessory {
  private service: Service;

  private discovery = new IPDiscovery();

  private exampleStates = {
    On: false,
  };

  constructor(
    private readonly platform: vdpPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Virtural Device Platform')
      .setCharacteristic(this.platform.Characteristic.Model, 'AccessoryKit')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Lightbulb) || this.accessory.addService(this.platform.Service.Lightbulb);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))                // SET - bind to the `setOn` method below
      .onGet(this.getOn.bind(this));               // GET - bind to the `getOn` method below

    this.discovery.on('serviceUp', (service) => {
      this.platform.log.debug('Found device:', service);
    });

    this.discovery.start();



  }


  async setOn(value: CharacteristicValue) {
    this.exampleStates.On = value as boolean;
    this.platform.log.debug('Set Characteristic On ->', value);
  }

  async getOn(): Promise<CharacteristicValue> {
    const isOn = this.exampleStates.On;
    this.platform.log.debug('Get Characteristic On ->', isOn);
    return isOn;
  }



}
