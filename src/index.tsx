import { VFC, useState, useEffect, useCallback, useMemo } from "react";
import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  SliderField,
  ToggleField,
  } from "decky-frontend-lib";
import { IoMdMegaphone } from "react-icons/io";
import { FaVolumeUp } from 'react-icons/fa';


// --- Constants and Helpers moved outside the component ---

const LOCAL_STORAGE_KEY_LEFT = 'left';
const LOCAL_STORAGE_KEY_RIGHT = 'right';
const LOCAL_STORAGE_KEY_SYNCED = 'synced';
const LEFT_CHANNEL_LABEL_SYNCED = 'Both Channels';
const LEFT_CHANNEL_LABEL_UNSYNCED = 'Left Channel';
const RIGHT_CHANNEL_LABEL = 'Right Channel';
const BOTH_CHANNELS = 'both';

/**
 * Helper to get initial state from localStorage.
 * It's generic and includes error handling for malformed JSON.
 */
function getInitialState<T>(key: string, defaultValue: T, property: string): T {
  const settingsString = localStorage.getItem(key);
  if (!settingsString) {
    return defaultValue;
  }
  try {
    const storedSettings = JSON.parse(settingsString);
    // Use nullish coalescing operator for safer check
    return storedSettings[property] ?? defaultValue;
  } catch {
    // If JSON is malformed, return the default value
    return defaultValue;
  }
}

/**
 * Helper to save state to localStorage.
 */
function saveState<T>(key:string, value: T, property: string) {
  localStorage.setItem(key, JSON.stringify({ [property]: value }));
};

// --- Main Component ---

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  // --- State Declarations ---
  // Use functional update to ensure localStorage is read only once
  const [leftVolume, setLeftVolume] = useState<number>(() => getInitialState(LOCAL_STORAGE_KEY_LEFT, 100, 'volume'));
  const [rightVolume, setRightVolume] = useState<number>(() => getInitialState(LOCAL_STORAGE_KEY_RIGHT, 100, 'volume'));
  const [isSynced, setIsSynced] = useState<boolean>(() => getInitialState(LOCAL_STORAGE_KEY_SYNCED, true, 'switchValue'));

  // --- API Interaction Logic ---

  // Fetches a single channel's volume from the backend
  const getSystemVolume = useCallback(async (channel: string): Promise<number | null> => {
    const res = await serverAPI.callPluginMethod<{ channel: string }, number>("get_volume_state", { channel });
    if (res.success) {
        return res.result;
    }
    console.error(`Failed to get volume for channel: ${channel}`);
    return null;
  }, [serverAPI]);

  // Sets system volume via the backend
  const setSystemVolume = useCallback(async (value: number, channel: string) => {
    const clampedValue = Math.min(Math.max(value, 0), 150);
    
    const res = await serverAPI.callPluginMethod<{ value: number, channel: string }, boolean>(
      "set_volume_state", 
      { value: clampedValue, channel }
    );

    if (res.success) {
      // Update UI state directly for a snappier response
      if (channel === BOTH_CHANNELS || channel === LOCAL_STORAGE_KEY_LEFT) {
        setLeftVolume(clampedValue);
        saveState(LOCAL_STORAGE_KEY_LEFT, clampedValue, 'volume');
      }
      if (channel === BOTH_CHANNELS || channel === LOCAL_STORAGE_KEY_RIGHT) {
        setRightVolume(clampedValue);
        saveState(LOCAL_STORAGE_KEY_RIGHT, clampedValue, 'volume');
      }
    } else {
        // If the call fails, refresh the state from the backend to ensure UI is accurate
        console.error(`Failed to set volume for channel: ${channel}. Re-fetching state.`);
        getSystemVolume(LOCAL_STORAGE_KEY_LEFT).then(vol => vol !== null && setLeftVolume(vol));
        getSystemVolume(LOCAL_STORAGE_KEY_RIGHT).then(vol => vol !== null && setRightVolume(vol));
    }
  }, [serverAPI, getSystemVolume]);


  // --- Effects ---

  // Effect to fetch initial volume states from the backend on mount
  useEffect(() => {
    getSystemVolume(LOCAL_STORAGE_KEY_LEFT).then(vol => {
        if (vol !== null) {
            setLeftVolume(vol);
            // If synced, ensure the right channel matches upon loading
            if (isSynced) {
              setRightVolume(vol);
            }
        }
    });
    // Only fetch right volume separately if not synced
    if (!isSynced) {
        getSystemVolume(LOCAL_STORAGE_KEY_RIGHT).then(vol => vol !== null && setRightVolume(vol));
    }
  }, [serverAPI, getSystemVolume]); // Intentionally exclude `isSynced` to run only once on mount

  
  // --- Event Handlers ---

  // Handles the sync toggle switch
  const handleSyncToggle = useCallback((synced: boolean) => {
    setIsSynced(synced);
    saveState(LOCAL_STORAGE_KEY_SYNCED, synced, 'switchValue');
    // If channels are now synced, match the right volume to the left
    if (synced) {
      setRightVolume(leftVolume);
      // Update the backend. We only need to tell it to set the right channel.
      setSystemVolume(leftVolume, LOCAL_STORAGE_KEY_RIGHT);
    }
  }, [leftVolume, setSystemVolume]);
  
  // Debounced version of setSystemVolume to avoid spamming the backend
  const debouncedSetSystemVolume = useMemo(() => {
    let timeout: NodeJS.Timeout | null;
    return (value: number, channel: string) => {
      clearTimeout(timeout as NodeJS.Timeout);
      timeout = setTimeout(() => {
        setSystemVolume(value, channel);
      }, 200); // 200ms delay is a good balance for sliders
    };
  }, [setSystemVolume]);
  
  const handleLeftSliderChange = (value: number) => {
    // Update the UI immediately for responsiveness
    setLeftVolume(value);
    if (isSynced) {
      setRightVolume(value);
    }
    // Call the debounced function to update the backend
    debouncedSetSystemVolume(value, isSynced ? BOTH_CHANNELS : LOCAL_STORAGE_KEY_LEFT);
  };
  
  const handleRightSliderChange = (value: number) => {
    setRightVolume(value);
    debouncedSetSystemVolume(value, LOCAL_STORAGE_KEY_RIGHT);
  };

  // --- Render Logic ---
  const leftChannelLabel = isSynced ? LEFT_CHANNEL_LABEL_SYNCED : LEFT_CHANNEL_LABEL_UNSYNCED;

  return (
    <PanelSection title="Settings">
        <PanelSectionRow>
          <ToggleField
            bottomSeparator='standard'
            checked={isSynced}
            label='Sync Channels'
            description='Link the left and right channel sliders'
            onChange={handleSyncToggle} 
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            value={leftVolume}
            min={0}
            max={150}
            step={1}
            notchCount={5}
            notchTicksVisible={true}
            label={leftChannelLabel}
            description={`Adjust volume for ${isSynced ? 'both channels' : 'the left channel'}`}
            editableValue
            icon={<FaVolumeUp />}
            onChange={handleLeftSliderChange}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField
            value={rightVolume}
            min={0}
            max={150}
            step={1}
            notchCount={5}
            notchTicksVisible={true}
            label={RIGHT_CHANNEL_LABEL}
            description='Adjust volume for the right channel'
            editableValue
            icon={<FaVolumeUp />}
            onChange={handleRightSliderChange}
            disabled={isSynced}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{color: '#8a9da6', fontSize: '0.9em', lineHeight: '1.2em'}}>
            Note: Increasing volume above 100% may cause audio distortion or damage your speakers. Use at your own risk.
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
