import subprocess
import traceback
import os
import decky_plugin

os.environ['XDG_RUNTIME_DIR'] = '/run/user/1000'


class Plugin:
    """Plugin for controlling volume of the system"""

    async def get_volume_state(self, channel='both'):
        try:
            output = subprocess.check_output(['pactl info'], text=True, shell=True)
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith('Default Sink:')), None)
            output = subprocess.check_output([f'pactl get-sink-volume {default_sink}'], text=True, shell=True)
            volume_left = int(output.split()[4].strip("%"))
            volume_right = int(output.split()[11].strip("%"))
            if channel == 'right':
                return volume_right
            return volume_left
        except Exception as error:
            decky_plugin.logger.info(f"Failed to get volume: {traceback.format_exc(error)}")
            return 0

    async def set_volume_state(self, value, channel='both'):
        try:
            output = subprocess.check_output(['pactl info'], text=True, shell=True)
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith('Default Sink:')), None)
            output = subprocess.check_output([f'pactl get-sink-volume {default_sink}'], text=True, shell=True)
            volume_left = int(output.split()[4].strip("%"))
            volume_right = int(output.split()[11].strip("%"))
            if channel == 'both':
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {value}%"], shell=True)
            elif channel == 'left':
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {value}% {volume_right}%"], shell=True)
            elif channel == 'right':
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {volume_left}% {value}%"], shell=True)
            return result
        except Exception as error:
            decky_plugin.logger.info(f"Failed to set volume: {traceback.format_exc(error)}")
            return False

if __name__ == "__main__":
    import asyncio
    plugin = Plugin()
    asyncio.run(plugin.set_volume_state(50))
    asyncio.run(plugin.get_volume_state())
