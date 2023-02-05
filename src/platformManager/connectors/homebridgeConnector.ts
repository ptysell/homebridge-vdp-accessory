import { API, Logger, PlatformConfig, PlatformAccessory, UnknownContext } from 'homebridge';
import { HOMEBRIDGE_CONFIGURATION_FILE_PATH, PLATFORM_NAME} from '../../platformSettings';
import { platformConfiguration, platformConfigurationPlatforms } from '../../platformInterfaces/platformInterfaces';

import fs from 'fs';
import { platformConnector } from './platformConnector';


export class homebridgeConnector extends platformConnector {

  public name = 'homebridgeConnector';
  protected deviceList: PlatformAccessory<UnknownContext>[] = [];

  private cachedConfigurationTimeStamp = 0;
  private cachedConfigurationFile = '';
  private cachedConfigurationData = '';

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    super(log, config, api, HOMEBRIDGE_CONFIGURATION_FILE_PATH);
    //this.initialize();
  }

  protected async initialize(): Promise<void> {
    this.log.debug('[homebridgeConnector]<initalize>(Start of Function)');

    this.log.debug('[homebridgeConnector]<initalize>Getting Configuration File TimeStamp');
    this.cachedConfigurationTimeStamp = fs.statSync(HOMEBRIDGE_CONFIGURATION_FILE_PATH).ctimeMs;
    this.log.debug('[homebridgeConnector]<initalize>Getting Configuration File');
    this.cachedConfigurationFile = fs.readFileSync(HOMEBRIDGE_CONFIGURATION_FILE_PATH, 'utf-8');

    const currentConfigurationFile: platformConfiguration = JSON.parse(this.cachedConfigurationFile);
    const platformIndex = currentConfigurationFile.platforms.findIndex(
      (platformConfigurationPlatforms) => platformConfigurationPlatforms.platform === PLATFORM_NAME,
    );
    this.log.error('----------Start Platform----------');
    this.log.error('Name:', currentConfigurationFile.platforms[platformIndex].name);
    this.log.error('Platform Name:', currentConfigurationFile.platforms[platformIndex].platform);
    this.log.error('Data:', JSON.stringify(currentConfigurationFile.platforms[platformIndex]));
    this.log.error('----------End Platform----------');





    this.log.debug('[homebridgeConnector]<initalize>(End of Function)');
  }

  private async loadConfigurationFromJSON(configurationFile: string): Promise<boolean | void> {

    return;
  }


  public async status(): Promise<boolean | void> {
    this.log.error('[homebridgeConnector]<status> Method not implemented.');
    return true;
  }

  public async refresh(): Promise<void> {
    this.log.error('[homebridgeConnector]<refresh> Method not implemented.');
  }

  public async get(): Promise<PlatformAccessory[]> {
    this.log.error('[homebridgeConnector]<get> Method not implemented.');
    return this.deviceList;
  }

  public async update(): Promise<boolean | void> {
    this.log.error('[homebridgeConnector]<update> Method not implemented.');
  }

}