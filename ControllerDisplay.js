window.AHRS = require('ahrs');

class ControllerDisplay {
    constructor() {
        this.PATH                 = 'models/';
        this.TILT                 = Math.PI * 0.2;
        this.gearVRController     = null;
        this.material             = null;
        this.materialImage        = null;
        this.ctx                  = null;
        this.selectedDeviceAction = null;
        this.ahrs                 = new AHRS({
            sampleInterval: 10,
            algorithm:      'Madgwick',
            beta:           0.8,
            // kp:             0.5,
            // ki:             0
        });

        this.lastTimestamp = 0;

        this.camera = new THREE.PerspectiveCamera(
            70,
            innerWidth / innerHeight,
            0.01,
            10
        );

        this.camera.position.z = 1;

        this.scene            = new THREE.Scene();
        this.scene.background = new THREE.Color(0x303a4a);

        let light;

        light = new THREE.PointLight(0xaaaaaa, 1, 100);
        light.position.set(15, 15, -15);
        this.scene.add(light);

        light = new THREE.PointLight(0xcccccc, 1, 100);
        light.position.set(15, -15, 15);
        this.scene.add(light);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Bind to self because ES6 classes suck vs TS
        this.animate                   = this.animate.bind(this);
        this.updateTexture             = this.updateTexture.bind(this);
        this.log                       = this.log.bind(this);
        this.onMTLLoaded               = this.onMTLLoaded.bind(this);
        this.onOBJLoaded               = this.onOBJLoaded.bind(this);
        this.onSelectDeviceAction      = this.onSelectDeviceAction.bind(this);
        this.onClickDeviceActionButton = this.onClickDeviceActionButton.bind(this);
        this.onControllerDataReceived  = this.onControllerDataReceived.bind(this);

        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(this.PATH);
        mtlLoader.load('gear_vr_controller.mtl', this.onMTLLoaded);

        document.getElementById('deviceActions').addEventListener(
            'change',
            this.onSelectDeviceAction
        );

        document.getElementById('deviceActionsButton').addEventListener(
            'click',
            this.onClickDeviceActionButton
        );

        this.logElement = document.getElementById('deviceActionsLog');
    }

    log(msg) {
        this.logElement.innerHTML = msg;
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    onMTLLoaded(materials) {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(this.PATH);
        objLoader.load('gear_vr_controller.obj', this.onOBJLoaded);

    };

    onOBJLoaded(object) {
        object.scale.set(15, 15, 15);
        object.position.set(0, 0.1, -0.5);
        object.rotation.set(this.TILT, 0, 0); //.set(-this.TILT, Math.PI, 0);
        this.scene.add(object);
        this.animate();

        this.gearVRController  = object;
        this.material          = object.children[0].material;
        this.materialImage     = new Image();
        this.materialImage.src = this.material.map.image.src;

        const canvas  = document.createElement('canvas');
        canvas.width  = this.materialImage.width;
        canvas.height = this.materialImage.height;
        this.ctx      = canvas.getContext('2d');

        this.canvas = canvas;
        //document.body.appendChild(canvas);
    }

    updateTexture(options) {
        const PI2  = Math.PI * 2;
        const PI_4 = Math.PI * 0.25;
        const {
                  backButton,
                  homeButton,
                  touchpadButton,
                  triggerButton,
                  axisX, axisY,
                  volumeUpButton,
                  volumeDownButton,
                  isBluetoothLightOn
              }    = options;

        const {ctx} = this;

        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.drawImage(this.materialImage, 0, 0);

        if (touchpadButton) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(197, 60, 30, 0, PI2);
            ctx.fill();
        }

        if (volumeUpButton) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(106, 13, 11, 0, PI2);
            ctx.fill();
        }

        if (volumeDownButton) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(140, 13, 11, 0, PI2);
            ctx.fill();
        }

        if (backButton) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(24, 18, 20, 0, PI2);
            ctx.fill();
        }

        if (homeButton) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(124, 44, 20, 0, PI2);
            ctx.fill();
        }

        if (triggerButton) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(113, 61);
            ctx.lineTo(138, 61);
            ctx.lineTo(152, 113);
            ctx.lineTo(154, 170);
            ctx.lineTo(154, 230);
            ctx.lineTo(140, 256);
            ctx.lineTo(117, 256);
            ctx.lineTo(125, 220);
            ctx.lineTo(122, 163);
            ctx.lineTo(111, 120);
            ctx.lineTo(122, 163);
            ctx.lineTo(108, 101);
            ctx.fill();
        }

        if (axisX && axisY) {
            // Texture is mapped at an angle
            // Need to compensate for that rotation
            ctx.translate(197, 60);
            ctx.rotate(-PI_4);
            const cx = (axisX - 157.5) / 157.5 * 30;
            const cy = (axisY - 157.5) / 157.5 * 30;

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, PI2);
            ctx.fill();
            ctx.rotate(PI_4);
            ctx.translate(-197, -60);
        }

        if (isBluetoothLightOn) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(197, 208, 1, 0, PI2);
            ctx.fill();
        }

        this.material.map.image.src = this.canvas.toDataURL();
        this.material.needsUpdate   = true;
    }

    // For debug only
    setTextureURL(url) {
        this.material.map.image.src = `http://localhost:9000/models/${url}`;
        this.material.needsUpdate   = true;
    }

    onSelectDeviceAction(e) {
        const {value}             = e.target;
        this.selectedDeviceAction = value;
    }

    onControllerDataReceived(data) {
        const timestampSeconds = data.timestamp * 0.001;
        this.updateTexture(data);

        if (this.lastTimestamp) {


            this.ahrs.update(
                data.gyro[0] * 0.001,
                data.gyro[1] * 0.001,
                data.gyro[2] * 0.001,
                data.accel[0] * 0.0001,
                data.accel[1] * 0.0001,
                data.accel[2] * 0.0001,
                data.magX, data.magY, data.magZ,
                timestampSeconds - this.lastTimestamp
            );
            //
            // this.ahrs.update(
            //     data.gyro[3] * 0.001,
            //     data.gyro[4] * 0.001,
            //     data.gyro[5] * 0.001,
            //     data.accel[3] * 0.0001,
            //     data.accel[4] * 0.0001,
            //     data.accel[5] * 0.0001,
            //     //data.magX, data.magY, data.magZ
            // );
            // this.ahrs.update(
            //     data.gyro[6] * 0.001,
            //     data.gyro[7] * 0.001,
            //     data.gyro[8] * 0.001,
            //     data.accel[6] * 0.0001,
            //     data.accel[7] * 0.0001,
            //     data.accel[8] * 0.0001,
            //     data.magX, data.magY, data.magZ,
            //     data.timestamp - this.lastTimestamp
            // );
        }

        this.lastTimestamp = timestampSeconds;


        const {heading, pitch, roll} = this.ahrs.getEulerAngles();
        this.gearVRController.rotation.set(roll, heading, pitch, 'ZYX');
    }

    onClickDeviceActionButton() {
        switch (this.selectedDeviceAction) {
            case 'pair':
                controllerBluetoothInterface.pair();
                break;

            case 'disconnect':
                controllerBluetoothInterface.runCommand(ControllerBluetoothInterface.CMD_OFF)
                    .then(() => controllerBluetoothInterface.disconnect());
                break;

            case 'sensor':
                // Have to do the SENSOR -> VR -> SENSOR cycle a few times to ensure it runs
                controllerBluetoothInterface.runCommand(ControllerBluetoothInterface.CMD_VR_MODE)
                    .then(() => controllerBluetoothInterface.runCommand(ControllerBluetoothInterface.CMD_SENSOR));
                break;

            default:
        }
    }
}

const controllerDisplay            = new ControllerDisplay();
const controllerBluetoothInterface = new ControllerBluetoothInterface(
    controllerDisplay.onControllerDataReceived
);