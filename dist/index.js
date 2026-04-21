(function (React, deckyFrontendLib) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

  var __assign = window && window.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }

      return t;
    };

    return __assign.apply(this, arguments);
  };

  var __rest = window && window.__rest || function (s, e) {
    var t = {};

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };

  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React__default["default"].createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }

  function GenIcon(data) {
    return function (props) {
      return React__default["default"].createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
          size = props.size,
          title = props.title,
          svgProps = __rest(props, ["attr", "size", "title"]);

      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + ' ' : '') + props.className;
      return React__default["default"].createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React__default["default"].createElement("title", null, title), props.children);
    };

    return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function IoMdMegaphone (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M382.1 143.4l-23.1 23c14.7 14.7 23.9 35.2 23.9 57.6s-9.2 42.9-23.9 57.6l23.1 23.1c20.6-20.6 33.4-49.2 33.4-80.6s-12.8-60.1-33.4-80.7z"}},{"tag":"path","attr":{"d":"M428.2 99l-22.7 22.7c26.1 26.1 42.3 62.4 42.3 102.3 0 39.8-16.1 76.1-42.3 102.3l22.7 22.7c31.9-32.1 51.8-76.3 51.8-125s-19.8-92.9-51.8-125zM320 184.1V80h-32l-96 80H64l-32 16v112l32 16 80 128h48l-30-128h30l96 64h32V263.9c18.4-1.7 32-18.9 32-39.9s-13.6-38.2-32-39.9z"}}]})(props);
  }

  // THIS FILE IS AUTO GENERATED
  function FaVolumeUp (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"}}]})(props);
  }

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
  function getInitialState(key, defaultValue, property) {
      const settingsString = localStorage.getItem(key);
      if (!settingsString) {
          return defaultValue;
      }
      try {
          const storedSettings = JSON.parse(settingsString);
          // Use nullish coalescing operator for safer check
          return storedSettings[property] ?? defaultValue;
      }
      catch {
          // If JSON is malformed, return the default value
          return defaultValue;
      }
  }
  /**
   * Helper to save state to localStorage.
   */
  function saveState(key, value, property) {
      localStorage.setItem(key, JSON.stringify({ [property]: value }));
  }
  // --- Main Component ---
  const Content = ({ serverAPI }) => {
      // --- State Declarations ---
      // Use functional update to ensure localStorage is read only once
      const [leftVolume, setLeftVolume] = React.useState(() => getInitialState(LOCAL_STORAGE_KEY_LEFT, 100, 'volume'));
      const [rightVolume, setRightVolume] = React.useState(() => getInitialState(LOCAL_STORAGE_KEY_RIGHT, 100, 'volume'));
      const [isSynced, setIsSynced] = React.useState(() => getInitialState(LOCAL_STORAGE_KEY_SYNCED, true, 'switchValue'));
      // --- API Interaction Logic ---
      // Fetches a single channel's volume from the backend
      const getSystemVolume = React.useCallback(async (channel) => {
          const res = await serverAPI.callPluginMethod("get_volume_state", { channel });
          if (res.success) {
              return res.result;
          }
          console.error(`Failed to get volume for channel: ${channel}`);
          return null;
      }, [serverAPI]);
      // Sets system volume via the backend
      const setSystemVolume = React.useCallback(async (value, channel) => {
          const clampedValue = Math.min(Math.max(value, 0), 150);
          const res = await serverAPI.callPluginMethod("set_volume_state", { value: clampedValue, channel });
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
          }
          else {
              // If the call fails, refresh the state from the backend to ensure UI is accurate
              console.error(`Failed to set volume for channel: ${channel}. Re-fetching state.`);
              getSystemVolume(LOCAL_STORAGE_KEY_LEFT).then(vol => vol !== null && setLeftVolume(vol));
              getSystemVolume(LOCAL_STORAGE_KEY_RIGHT).then(vol => vol !== null && setRightVolume(vol));
          }
      }, [serverAPI, getSystemVolume]);
      // --- Effects ---
      // Effect to fetch initial volume states from the backend on mount
      React.useEffect(() => {
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
      const handleSyncToggle = React.useCallback((synced) => {
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
      const debouncedSetSystemVolume = React.useMemo(() => {
          let timeout;
          return (value, channel) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                  setSystemVolume(value, channel);
              }, 200); // 200ms delay is a good balance for sliders
          };
      }, [setSystemVolume]);
      const handleLeftSliderChange = (value) => {
          // Update the UI immediately for responsiveness
          setLeftVolume(value);
          if (isSynced) {
              setRightVolume(value);
          }
          // Call the debounced function to update the backend
          debouncedSetSystemVolume(value, isSynced ? BOTH_CHANNELS : LOCAL_STORAGE_KEY_LEFT);
      };
      const handleRightSliderChange = (value) => {
          setRightVolume(value);
          debouncedSetSystemVolume(value, LOCAL_STORAGE_KEY_RIGHT);
      };
      // --- Render Logic ---
      const leftChannelLabel = isSynced ? LEFT_CHANNEL_LABEL_SYNCED : LEFT_CHANNEL_LABEL_UNSYNCED;
      return (window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Settings" },
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.ToggleField, { bottomSeparator: 'standard', checked: isSynced, label: 'Sync Channels', description: 'Link the left and right channel sliders', onChange: handleSyncToggle })),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.SliderField, { value: leftVolume, min: 0, max: 150, step: 1, notchCount: 5, notchTicksVisible: true, label: leftChannelLabel, description: `Adjust volume for ${isSynced ? 'both channels' : 'the left channel'}`, editableValue: true, icon: window.SP_REACT.createElement(FaVolumeUp, null), onChange: handleLeftSliderChange })),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement(deckyFrontendLib.SliderField, { value: rightVolume, min: 0, max: 150, step: 1, notchCount: 5, notchTicksVisible: true, label: RIGHT_CHANNEL_LABEL, description: 'Adjust volume for the right channel', editableValue: true, icon: window.SP_REACT.createElement(FaVolumeUp, null), onChange: handleRightSliderChange, disabled: isSynced })),
          window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
              window.SP_REACT.createElement("div", { style: { color: '#8a9da6', fontSize: '0.9em', lineHeight: '1.2em' } }, "Note: Increasing volume above 100% may cause audio distortion or damage your speakers. Use at your own risk."))));
  };
  var index = deckyFrontendLib.definePlugin((serverApi) => {
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "Volume Boost"),
          content: window.SP_REACT.createElement(Content, { serverAPI: serverApi }),
          icon: window.SP_REACT.createElement(IoMdMegaphone, null),
      };
  });

  return index;

})(SP_REACT, DFL);
