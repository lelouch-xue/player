import Player from '~/core/index';
import _debug from '../core/utils/console';

const player = new Player({
  container: '#my-player',
});

function loadImage(src, minWidth = 1) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const handler = () => {
      // delete image.onload;
      // delete image.onerror;
      (image.naturalWidth >= minWidth ? resolve : reject)(image);
    };

    Object.assign(image, { onload: handler, onerror: handler, src });
    console.log(image);
  });
}

// _debug.log(player);
// _debug.error('sdfsdf');
// _debug.warn('sdfsdf');
loadImage(
  '//www2.autoimg.cn/newsdfs/g24/M01/06/A7/45x45_f41_autohomecar__Chtk3WC0nISAVvOqAAFyBJMECLc374.jpg'
).then((res) => console.log(res));
