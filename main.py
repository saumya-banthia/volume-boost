import subprocess
import re
import os
import decky_plugin

# This is a good workaround for the Decky environment
os.environ['XDG_RUNTIME_DIR'] = '/run/user/1000'

class Plugin:
    """Plugin for controlling volume of the system"""
    # Define constants for clarity
    CHANNEL_LEFT = 'left'
    CHANNEL_RIGHT = 'right'
    CHANNEL_BOTH = 'both'

    @staticmethod
    async def _get_default_sink():
        """Finds and returns the name of the default audio sink."""
        try:
            # Run 'pactl info' to find the default sink
            info_output = subprocess.check_output(['pactl', 'info'], text=True, timeout=5)
            # Search for the 'Default Sink:' line and extract its value
            for line in info_output.split('\n'):
                if line.strip().startswith('Default Sink:'):
                    return line.split(':')[1].strip()
            # If not found, log an error and return None
            decky_plugin.logger.error("Could not find Default Sink in 'pactl info' output.")
            return None
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            decky_plugin.logger.error(f"Failed to get default sink: {e}")
            return None

    @staticmethod
    async def _get_current_volumes(sink):
        """Gets the current left and right volume percentages for a given sink."""
        if not sink:
            return None, None
        try:
            # Command to get the sink volume
            cmd = ['pactl', 'get-sink-volume', sink]
            vol_output = subprocess.check_output(cmd, text=True, timeout=5)
            
            # Use regular expressions for robust parsing
            # This looks for 'front-left: ... XX%' and 'front-right: ... YY%'
            left_match = re.search(r'front-left:.*?(\d+)%', vol_output)
            right_match = re.search(r'front-right:.*?(\d+)%', vol_output)

            if left_match and right_match:
                left_vol = int(left_match.group(1))
                right_vol = int(right_match.group(1))
                return left_vol, right_vol
            
            decky_plugin.logger.error(f"Could not parse volume from pactl output: {vol_output}")
            return None, None
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            decky_plugin.logger.error(f"Failed to get current volumes for sink {sink}: {e}")
            return None, None

    # Public method called by the frontend
    async def get_volume_state(self, channel):
        """Get volume state of the system."""
        sink = await Plugin._get_default_sink()
        left_vol, right_vol = await Plugin._get_current_volumes(sink)
        
        if left_vol is None or right_vol is None:
            return 0 # Return a default value on failure
        
        return right_vol if channel == self.CHANNEL_RIGHT else left_vol

    # Public method called by the frontend
    async def set_volume_state(self, value, channel):
        """Set volume state of the system."""
        sink = await Plugin._get_default_sink()
        if not sink:
            return False

        left_vol, right_vol = await Plugin._get_current_volumes(sink)
        if left_vol is None or right_vol is None:
            return False # Cannot set volume if we can't read the current state

        # Determine the target volumes for left and right channels
        target_left = value if channel in (self.CHANNEL_LEFT, self.CHANNEL_BOTH) else left_vol
        target_right = value if channel in (self.CHANNEL_RIGHT, self.CHANNEL_BOTH) else right_vol

        try:
            # Build the command as a list to avoid shell=True
            # The command can set both channels at once
            cmd = ['pactl', 'set-sink-volume', sink, f'{target_left}%', f'{target_right}%']
            decky_plugin.logger.info(f"Executing command: {' '.join(cmd)}")
            
            # Use subprocess.run for better control
            result = subprocess.run(cmd, check=True, text=True, capture_output=True, timeout=5)
            decky_plugin.logger.info(f"Set volume result: {result.stdout}")
            return True
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            # Log the actual error output from the command
            decky_plugin.logger.error(f"Failed to set volume. Command: '{e.cmd}'. Stderr: {e.stderr}")
            return False
