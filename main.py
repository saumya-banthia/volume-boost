import logging
import subprocess
import traceback
import os

logging.basicConfig(
    filename="/home/deck/homebrew/logs/volume-boost/python.log",
    format='[volumeBoost] %(asctime)s %(levelname)s %(message)s',
    filemode='w+',
    force=True
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # can be changed to logging.DEBUG for debugging issues
os.environ['XDG_RUNTIME_DIR'] = '/run/user/1000'


class Plugin:

    async def get_volume_state(self, channel='both'):
        default_sink = None

        try:
            output = subprocess.check_output(['pactl info'], text=True, shell=True)
            # logger.debug(f"pactl info: {output}")
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith('Default Sink:')), None)
            output = subprocess.check_output([f'pactl get-sink-volume {default_sink}'], text=True, shell=True)
            # logger.debug(f"pactl get-sink-volume: {output}")
            volume_left = int(output.split()[4].strip("%"))
            volume_right = int(output.split()[11].strip("%"))
            if channel == 'right':
                return volume_right
            return volume_left
        except Exception as error:
            logger.error(f"Failed to get volume: {traceback.format_exc(error)}")
            return 0

    async def set_volume_state(self, value, channel='both'):
        default_sink = None

        try:
            output = subprocess.check_output(['pactl info'], text=True, shell=True)
            # logger.debug(f"pactl info: {output}")
            default_sink = next((line.split(':')[1].strip() for line in output.split('\n') if line.startswith('Default Sink:')), None)
            output = subprocess.check_output([f'pactl get-sink-volume {default_sink}'], text=True, shell=True)
            if channel == 'both':
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {value}%"], shell=True)
            elif channel == 'left':
                volume_right = int(output.split()[11].strip("%"))
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {value}% {volume_right}%"], shell=True)
            elif channel == 'right':
                volume_left = int(output.split()[4].strip("%"))
                result = not subprocess.call([f"pactl set-sink-volume {default_sink} {volume_left}% {value}%"], shell=True)
            # logger.debug(f"Volume set to {value}% successfully: {result}")
            return result
        except Exception as error:
            logger.error(f"Failed to set volume: {traceback.format_exc(error)}")
            return False

if __name__ == "__main__":
    import asyncio
    plugin = Plugin()
    asyncio.run(plugin.set_volume_state(50))
    asyncio.run(plugin.get_volume_state())
