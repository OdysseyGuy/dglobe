import {EventDispatcher, Quaternion, Vector3} from 'three';

const _changeEvent = {
  type: 'change',
};

// TODO: Fix rotational motion
class FlyCamera extends EventDispatcher {
  constructor(camera, domElement) {
    super();

    this.camera = camera;
    this.domElement = domElement;

    if (domElement === undefined) {
      domElement = document;
    }

    // Camera movement speed
    this.movementSpeed = 1.0;
    this.rotSpeed = 1;

    const lastPosition = new Vector3();
    this.moveVector = new Vector3(0, 0, 0);

    const lastQuaternion = new Quaternion();
    this.rotationVector = new Vector3(0, 0, 0);
    this.tmpQuaternion = new Quaternion();

    const EPSILON = 0.000001;

    this.mouseDownStatus = 0;

    this.moveState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      forward: 0,
      backward: 0,
      pitchUp: 0,
      pitchDown: 0,
      yawLeft: 0,
      yawRight: 0,
      rollLeft: 0,
      rollRight: 0,
    };

    this.keydown = (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveState.forward = 1;
          break;
        case 'KeyS':
          this.moveState.backward = 1;
          break;
        case 'KeyA':
          this.moveState.left = 1;
          break;
        case 'KeyD':
          this.moveState.right = 1;
          break;
        case 'KeyQ':
          this.moveState.up = 1;
          break;
        case 'KeyE':
          this.moveState.down = 1;
          break;
      }

      this.updateMovementVector();
      this.updateRotationVector();
    };

    this.keyup = (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveState.forward = 0;
          break;
        case 'KeyS':
          this.moveState.backward = 0;
          break;
        case 'KeyA':
          this.moveState.left = 0;
          break;
        case 'KeyD':
          this.moveState.right = 0;
          break;
        case 'KeyQ':
          this.moveState.up = 0;
          break;
        case 'KeyE':
          this.moveState.down = 0;
          break;
      }

      this.updateMovementVector();
      this.updateRotationVector();
    };

    this.mousedown = (event) => {
      // Right mouse click
      if (event.button === 2) {
        this.mouseDownStatus = 1;
      }
    };

    this.mouseup = (event) => {
      if (event.button === 2) {
        this.mouseDownStatus = 0;
        this.moveState.yawLeft = this.moveState.pitchDown = 0;
      }

      this.updateRotationVector();
    };

    this.mousemove = (event) => {
      if (this.mouseDownStatus > 0) {
        const containerDim = this.getContainerDimensions();
        const halfWidth = containerDim.size[0] / 2;
        const halfHeight = containerDim.size[1] / 2;

        this.moveState.yawLeft =
            -(event.pageX - containerDim.offset[0] - halfWidth) / halfWidth;
        this.moveState.pitchDown =
            (event.pageY - containerDim.offset[1] - halfHeight) / halfHeight;

        this.updateRotationVector();
      }
    };

    this.getContainerDimensions = () => {
      if (this.domElement != document) {
        return {
          size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
          offset: [this.domElement.offsetLeft, this.domElement.offsetTop],
        };
      } else {
        return {
          size: [window.innerWidth, window.innerHeight],
          offset: [0, 0],
        };
      }
    };

    this.updateMovementVector = () => {
      this.moveVector.x = -this.moveState.left + this.moveState.right;
      this.moveVector.y = -this.moveState.down + this.moveState.up;
      this.moveVector.z = -this.moveState.forward + this.moveState.backward;
    };

    this.updateRotationVector = () => {
      this.rotationVector.x =
          -this.moveState.pitchDown + this.moveState.pitchUp;
      this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft;
      this.rotationVector.z =
          -this.moveState.rollRight + this.moveState.rollLeft;
    };

    this.update = (deltaTime) => {
      const moveMult = deltaTime * this.movementSpeed;
      const rotMult = deltaTime * this.rotSpeed;

      this.camera.translateX(this.moveVector.x * moveMult);
      this.camera.translateY(this.moveVector.y * moveMult);
      this.camera.translateZ(this.moveVector.z * moveMult);

      // rotation vector -> quaternion
      this.tmpQuaternion
          .set(
              this.rotationVector.x * deltaTime,
              this.rotationVector.y * deltaTime,
              this.rotationVector.z * deltaTime, 1)
          .normalize();

      this.camera.quaternion.multiply(this.tmpQuaternion);

      // new quaternion -> last quaternion
      // new position -> last position
      if (lastPosition.distanceToSquared(this.camera.position) > EPSILON ||
          8 * (1 - lastQuaternion.dot(this.camera.quaternion)) > EPSILON) {
        this.dispatchEvent(_changeEvent);
        lastQuaternion.copy(this.camera.quaternion);
        lastPosition.copy(this.camera.position);
      }
    };

    this.dispose = () => {
      this.domElement.removeEventListener('contextmenu', contextmenu);

      this.domElement.removeEventListener('mousemove', _mousemove);
      this.domElement.removeEventListener('mouseup', _mouseup);
      this.domElement.removeEventListener('mousedown', _mousedown);

      window.removeEventListener('keyup', _keyup);
      window.removeEventListener('keydown', _keydown);
    };

    const _mousemove = this.mousemove.bind(this);
    const _mouseup = this.mouseup.bind(this);
    const _mousedown = this.mousedown.bind(this);
    const _keyup = this.keyup.bind(this);
    const _keydown = this.keydown.bind(this);

    this.domElement.addEventListener('contextmenu', contextmenu);

    this.domElement.addEventListener('mousemove', _mousemove);
    this.domElement.addEventListener('mouseup', _mouseup);
    this.domElement.addEventListener('mousedown', _mousedown);

    window.addEventListener('keyup', _keyup);
    window.addEventListener('keydown', _keydown);

    this.updateMovementVector();
    this.updateRotationVector();
  }
}

contextmenu = (event) => {
  event.preventDefault();
};

export {FlyCamera};