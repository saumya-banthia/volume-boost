import subprocess
import traceback
import os
import decky_plugin

os.environ['XDG_RUNTIME_DIR'] = '/run/user/1000'


class Plugin:
    """Plugin for controlling volume of the system"""
    pactl_info_cmd = ['pactl info']
    default_sink_txt = 'Default Sink:'
    pactl_get_vol_cmd = 'pactl get-sink-volume'
    pactl_set_vol_cmd = 'pactl set-sink-volume'
    fail_get_msg = 'Failed to get volume: '
    fail_set_msg = 'Failed to set volume: '
    channel_default = 'both'
    channel_right = 'right'

    async def get_volume_state(self, channel):
        """Get volume state of the system"""
        try:
            output = subprocess.check_output(self.pactl_info_cmd, text=True, shell=True)
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith(self.default_sink_txt)), None)
            output = subprocess.check_output([f'{self.pactl_get_vol_cmd} {default_sink}'], text=True, shell=True)
            volume_left = int(output.split()[4].strip("%"))
            volume_right = int(output.split()[11].strip("%"))
            if channel == self.channel_right:
                return volume_right
            return volume_left
        except Exception as error:
            decky_plugin.logger.info(f"{self.fail_get_msg}{traceback.format_exc(error)}")
            return 0

    async def set_volume_state(self, value, channel):
        """Set volume state of the system"""
        try:
            output = subprocess.check_output(self.pactl_info_cmd, text=True, shell=True)
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith(self.default_sink_txt)), None)
            output = subprocess.check_output([f'{self.pactl_get_vol_cmd} {default_sink}'], text=True, shell=True)
            volume_left = int(output.split()[4].strip("%"))
            volume_right = int(output.split()[11].strip("%"))
            channel_default_cmd_1 = f"{self.pactl_set_vol_cmd} {default_sink}"
            channel_default_cmd_2 = f"{channel_default_cmd_1} {value}%"
            if channel == self.channel_default:
                result = not subprocess.call([channel_default_cmd_2], shell=True)
            elif channel == 'left':
                result = not subprocess.call([f"{channel_default_cmd_2} {volume_right}%"], shell=True)
            elif channel == self.channel_right:
                result = not subprocess.call([f"{channel_default_cmd_1} {volume_left}% {value}%"], shell=True)
            return result
        except Exception as error:
            decky_plugin.logger.info(f"{self.fail_set_msg}{traceback.format_exc(error)}")
            return False

if __name__ == "__main__":
    import asyncio
    plugin = Plugin()
    asyncio.run(plugin.set_volume_state(50, 'both'))
    asyncio.run(plugin.get_volume_state('both'))
