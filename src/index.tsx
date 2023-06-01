import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  SliderField,
} from "decky-frontend-lib";
import { VFC,
         useState,
         useEffect
        } from "react";
import { IoMdMegaphone } from "react-icons/io";
import { FaVolumeUp } from 'react-icons/fa';

const LOCAL_STORAGE_KEY = 'volume-boost-state'

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [volumeState, setVolumeState] = useState<number>(getInitialState());

  function getInitialState() {
    const settingsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!settingsString) {
      return 0;
    }
    const storedSettings = JSON.parse(settingsString);
    return storedSettings.volume || 0;
  }

  const saveState = (volume: number) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ volume }));
  };

  const getDefaultSinkVolume = async () => {
    const data = await serverAPI.callPluginMethod<{}, number>("get_volume_state", {});
    if (data.success) {
      setVolumeState(data.result);
      saveState(data.result);
    }
  }

  useEffect(() => {
  getDefaultSinkVolume();
  }, [serverAPI]);
  
  const setDefaultSinkVolume = async(sliderValue: number) => {
    const value = Math.min(Math.max(sliderValue, 0), 150);
    console.log("Setting volume to: " + value);
    const data = await serverAPI.callPluginMethod<{ value: number }, boolean>("set_volume_state", { value })
    if (data.success) {
      getDefaultSinkVolume();
    }
  }

  return (
    <PanelSection title="Settings">
        <PanelSectionRow>
          <SliderField
            value={volumeState}
            min={0}
            max={150}
            step={1}
            label='Volume'
            description='Increases volume bounds of Default sound device to 150%'
            editableValue
            icon={<FaVolumeUp />}
            onChange={setDefaultSinkVolume}
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
