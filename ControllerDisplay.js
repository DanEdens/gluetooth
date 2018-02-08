class ControllerDisplay {
    constructor() {
        this.PATH             = 'models/';
        this.TILT             = Math.PI * 0.2;
        this.gearVRController = null;
        this.material         = null;
        this.materialImage    = null;
        this.ctx              = null;

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
        light.position.set(15, 15, 15);
        this.scene.add(light);

        light = new THREE.PointLight(0xcccccc, 1, 100);
        light.position.set(15, -15, 15);
        this.scene.add(light);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Bind to self because ES6 classes suck vs TS
        this.animate              = this.animate.bind(this);
        this.updateTexture        = this.updateTexture.bind(this);
        this.setRotation          = this.setRotation.bind(this);
        this.onMTLLoaded          = this.onMTLLoaded.bind(this);
        this.onOBJLoaded          = this.onOBJLoaded.bind(this);
        this.onSelectDeviceAction = this.onSelectDeviceAction.bind(this);

        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(this.PATH);
        mtlLoader.load('gear_vr_controller.mtl', this.onMTLLoaded);

        document.getElementById('deviceActions').addEventListener(
            'change',
            this.onSelectDeviceAction
        );
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
        //object.scale.set(10, 10, 10);
        object.position.set(0, 0.1, -0.5);
        object.rotation.set(this.TILT, 0, 0);
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
        document.body.appendChild(canvas);
    }

    updateTexture({touchPad,bluetoothLight}) {
        const {ctx}   = this;

        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.drawImage(this.materialImage, 0, 0);

        if (touchPad) {
            ctx.beginPath();
            ctx.arc(197, 60, 30, 0, 2 * Math.PI);
            ctx.fill();

            // Sample finger cursor
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(197, 50, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        if(bluetoothLight) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(197, 208, 1, 0, 2 * Math.PI);
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

    setRotation(eulerAnglesInRadians) {
        // alpha, beta, gamma
        const {a, b, g} = eulerAnglesInRadians;
        this.gearVRController.rotation.set(a, b, g);
    }

    onSelectDeviceAction(e) {
        const {value} = e.target;

        console.log(value);

        e.target.selectedIndex = 0;
    }
}

window.foo = new ControllerDisplay();
