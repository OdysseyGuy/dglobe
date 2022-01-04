import {EventDispatcher, Texture} from 'three';

const ProgressiveTextureLoader = () => {};

ProgressiveTextureLoader.prototype = Object.create(EventDispatcher.prototype);
ProgressiveTextureLoader.prototype.load = (textureUrlList) => {
  var texture = new Texture();

  var imageObj = this.imageObj = new Image();
  var loadIndex;

  imageObj.onload = () => {
    if (this.imageObj) {
      texture.image = imageObj;
      texture.needsUpdate = true;
    }

    if (loadIndex < images.length) {
      self.dispatchEvent({type: 'progress', imageIndex: loadIndex});
      imageObj.src = images[loadIndex++];
    } else {
      self.dispatchEvent({type: 'done'});
      self.imageObj = null;
    }
  };

  // fallback
  imageObj.onerror = () => {
    console.log('Error loading texture');
  };
};

ProgressiveTextureLoader.prototype.dispose = () => {

};