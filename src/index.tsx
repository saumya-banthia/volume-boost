import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  SliderField,
  ToggleField,
} from "decky-frontend-lib";
import { VFC,
         useState,
         useEffect
        } from "react";
import { IoMdMegaphone } from "react-icons/io";
import { FaVolumeUp } from 'react-icons/fa';

const LOCAL_STORAGE_KEY_LEFT = 'left'
const LOCAL_STORAGE_KEY_RIGHT = 'right'
const LOCAL_STORAGE_KEY_SYNCED = 'synced'
const LEFT_CHANNEL_LABEL_SYNCED = 'Both Channels'
const LEFT_CHANNEL_LABEL_UNSYNCED = 'Left Channel'
const BOTH_CHANNELS = 'both'

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [leftVolumeState, setLeftVolumeState] = useState<number>(getInitialState(LOCAL_STORAGE_KEY_LEFT));
  const [rightVolumeState, setRightVolumeState] = useState<number>(getInitialState(LOCAL_STORAGE_KEY_RIGHT));
  const [volumeSyncedState, setVolumeSyncedState] = useState<boolean>(getInitialState(LOCAL_STORAGE_KEY_SYNCED, true, 'switchValue'));
  const [leftChannelLabel, setLeftChannelLabel] = useState<string>(LEFT_CHANNEL_LABEL_SYNCED);

  function getInitialState(key: string, defaultState:any = 0, paramString:string = 'volume') {
    const settingsString = localStorage.getItem(key);
    if (!settingsString) {
      return defaultState;
    }
    const storedSettings = JSON.parse(settingsString);
    return storedSettings[paramString] || defaultState;
  }

  const saveState = (key: string, volume: number) => {
    localStorage.setItem(key, JSON.stringify({ volume }));
  };

  // Get default sink volume, given a channel
  const getDefaultSinkVolume = async (channel: string = BOTH_CHANNELS) => {
    const data = await serverAPI.callPluginMethod<{ channel: string }, number>("get_volume_state", { channel });
    if (data.success) {
      if (channel === BOTH_CHANNELS) {
        setRightVolumeState(data.result);
        setLeftVolumeState(data.result);
        saveState(LOCAL_STORAGE_KEY_LEFT, data.result);
        saveState(LOCAL_STORAGE_KEY_RIGHT, data.result);
      } else {
        if (channel === LOCAL_STORAGE_KEY_RIGHT) setRightVolumeState(data.result);
        if (channel === LOCAL_STORAGE_KEY_LEFT) setLeftVolumeState(data.result);
        saveState(channel, data.result);
      }
    }
  }

  useEffect(() => {
    const volumeSync = localStorage.getItem(LOCAL_STORAGE_KEY_SYNCED);
    if (volumeSync) {
      const { switchValue } = JSON.parse(volumeSync);
      setVolumeSyncedState(switchValue);
    }
    getDefaultSinkVolume(LOCAL_STORAGE_KEY_LEFT);
    getDefaultSinkVolume(LOCAL_STORAGE_KEY_RIGHT);
  }, [serverAPI]);

  // Set default sink volume, given a channel key and slider value
  const setDefaultSinkVolume = async (sliderValue: number, channel: string = BOTH_CHANNELS) => {
    const value = Math.min(Math.max(sliderValue, 0), 150);
    console.log("Setting "+ channel +" channel volume to: " + value);
    const data = await serverAPI.callPluginMethod<{ value: number, channel: string }, boolean>("set_volume_state", { value, channel })
    if (channel === BOTH_CHANNELS) {
      if (data.success) {
        getDefaultSinkVolume(LOCAL_STORAGE_KEY_LEFT);
        getDefaultSinkVolume(LOCAL_STORAGE_KEY_RIGHT);
      }
    } else {      
      if (data.success) {
        getDefaultSinkVolume(channel);
      }
    }
  }

  const toggleVolumeSynced = async(switchValue: boolean) => {
    setVolumeSyncedState(switchValue);
    localStorage.setItem(LOCAL_STORAGE_KEY_SYNCED, JSON.stringify({ switchValue }));
    if (switchValue) {
      setLeftChannelLabel(LEFT_CHANNEL_LABEL_SYNCED);
      setDefaultSinkVolume(leftVolumeState, LOCAL_STORAGE_KEY_RIGHT);
    } else {
      setLeftChannelLabel(LEFT_CHANNEL_LABEL_UNSYNCED);
    }
  }

  // Credits to @Tormak#6639 for this debounce function
  function debounce(func:Function, wait:number, immediate?:boolean) {
    let timeout:NodeJS.Timeout|null;
    return function (this:any) {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout as NodeJS.Timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
  }

  return (
    <PanelSection title="Settings">
        <PanelSectionRow>
          <ToggleField
            bottomSeparator='standard'
            checked={volumeSyncedState}
            label='Toggle Channel Sync'
            description='Toggles Channel Sync On or Off'
            onChange={toggleVolumeSynced} />
          <SliderField
            value={leftVolumeState}
            min={0}
            max={150}
            step={1}
            notchCount={5}
            notchTicksVisible={true}
            label={leftChannelLabel}
            description={'Increases volume bounds of Default sound device to 150% (' + (volumeSyncedState ? BOTH_CHANNELS + ' channels': LOCAL_STORAGE_KEY_LEFT + ' channel') + ')'}
            editableValue
            icon={<FaVolumeUp />}
            onChange={debounce((value: number) => setDefaultSinkVolume(value, volumeSyncedState ? BOTH_CHANNELS: LOCAL_STORAGE_KEY_LEFT), 250, true)}
          />
          <SliderField
            value={rightVolumeState}
            min={0}
            max={150}
            step={1}
            notchCount={5}
            notchTicksVisible={true}
            label={'Right Channel' + (volumeSyncedState ? ' (Channels Synced)' : '')}
            description='Increases volume bounds of Default sound device to 150% (right channel)'
            editableValue
            icon={<FaVolumeUp />}
            onChange={debounce((value: number) => setDefaultSinkVolume(value, LOCAL_STORAGE_KEY_RIGHT), 250, true)}
            disabled={volumeSyncedState}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <div>
            Note: It's recommended to not increase volume above 100%, 
            as it may cause distortion and damage to your speakers. 
            If you do increase the volume above 100% temporarily, 
            it's recommended to restore the volume to or below 100% when not in use. 
            Use at your own risk.
          </div>
        </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Volume Boost</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <IoMdMegaphone />,
  };
});
