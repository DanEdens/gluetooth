Using [JD-GUI](http://jd.benow.ca/) ([source](https://github.com/java-decompiler/jd-gui)) on decompiled APK 
(com.samsung.android.app.vr.input.service-dex2jar.jar)

Let `0000` = `com.samsung.android.app.vr.input.service`. These are some findings from the decompiled classes in that APK.

## 0000 > a

```

// 0000 > a > a.class
    // ??? Nothing

// 0000 > a > b.class
    // ~ Logging facilities for 0000

// 0000 > a > c.class
    // ~ I believe this is the "oculus package verifier" class referenced in d.class

// 0000 > a > d.class
    // ~ Handles Google Play Store updates to Gear VR Input Service package
    // Important stuff in this file:
    
    new Thread( ... "oculus package verifier").start(); // Likely a reference to 0000 > c.class 


// 0000 > a > e.class
    // ~ Load and runs software update packages

// 0000 > a > f.class
    // ~ Handle saving of preferences within input service

// 0000 > a > g.class
    // ~ Handles Bluetooth comms and standby modes ???


// 0000 > a > h.class
    // ~ Handles triggering software updates, update security, and licenses (EULA agreements) ???
    // Important stuff in this file:
    
    b.c("Util", "sendSerialToFotaServer"); // FOTA = Firmware-Over-The-Air (update mechanism)
    
    private static final Signature[] d = { 
        new Signature("308204d4308203bca003020102020900e5eff0a8f66d92b3300d06092a864886f70d01010505003081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d301e170d3131303632323132323531335a170d3338313130373132323531335a3081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d30820120300d06092a864886f70d01010105000382010d00308201080282010100e9f1edb42423201dce62e68f2159ed8ea766b43a43d348754841b72e9678ce6b03d06d31532d88f2ef2d5ba39a028de0857983cd321f5b7786c2d3699df4c0b40c8d856f147c5dc54b9d1d671d1a51b5c5364da36fc5b0fe825afb513ec7a2db862c48a6046c43c3b71a1e275155f6c30aed2a68326ac327f60160d427cf55b617230907a84edbff21cc256c628a16f15d55d49138cdf2606504e1591196ed0bdc25b7cc4f67b33fb29ec4dbb13dbe6f3467a0871a49e620067755e6f095c3bd84f8b7d1e66a8c6d1e5150f7fa9d95475dc7061a321aaf9c686b09be23ccc59b35011c6823ffd5874d8fa2a1e5d276ee5aa381187e26112c7d5562703b36210b020103a382010b30820107301d0603551d0e041604145b115b23db35655f9f77f78756961006eebe3a9e3081d70603551d230481cf3081cc80145b115b23db35655f9f77f78756961006eebe3a9ea181a8a481a53081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d820900e5eff0a8f66d92b3300c0603551d13040530030101ff300d06092a864886f70d0101050500038201010039c91877eb09c2c84445443673c77a1219c5c02e6552fa2fbad0d736bc5ab6ebaf0375e520fe9799403ecb71659b23afda1475a34ef4b2e1ffcba8d7ff385c21cb6482540bce3837e6234fd4f7dd576d7fcfe9cfa925509f772c494e1569fe44e6fcd4122e483c2caa2c639566dbcfe85ed7818d5431e73154ad453289fb56b607643919cf534fbeefbdc2009c7fcb5f9b1fa97490462363fa4bedc5e0b9d157e448e6d0e7cfa31f1a2faa9378d03c8d1163d3803bc69bf24ec77ce7d559abcaf8d345494abf0e3276f0ebd2aa08e4f4f6f5aaea4bc523d8cc8e2c9200ba551dd3d4e15d5921303ca9333f42f992ddb70c2958e776c12d7e3b7bd74222eb5c7a") 
    };
    
    private static final Signature[] e = { 
        new Signature("308204d4308203bca003020102020900d20995a79c0daad6300d06092a864886f70d01010505003081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d301e170d3131303632323132323531325a170d3338313130373132323531325a3081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d30820120300d06092a864886f70d01010105000382010d00308201080282010100c986384a3e1f2fb206670e78ef232215c0d26f45a22728db99a44da11c35ac33a71fe071c4a2d6825a9b4c88b333ed96f3c5e6c666d60f3ee94c490885abcf8dc660f707aabc77ead3e2d0d8aee8108c15cd260f2e85042c28d2f292daa3c6da0c7bf2391db7841aade8fdf0c9d0defcf77124e6d2de0a9e0d2da746c3670e4ffcdc85b701bb4744861b96ff7311da3603c5a10336e55ffa34b4353eedc85f51015e1518c67e309e39f87639ff178107f109cd18411a6077f26964b6e63f8a70b9619db04306a323c1a1d23af867e19f14f570ffe573d0e3a0c2b30632aaec3173380994be1e341e3a90bd2e4b615481f46db39ea83816448ec35feb1735c1f3020103a382010b30820107301d0603551d0e04160414932c3af70b627a0c7610b5a0e7427d6cfaea3f1e3081d70603551d230481cf3081cc8014932c3af70b627a0c7610b5a0e7427d6cfaea3f1ea181a8a481a53081a2310b3009060355040613024b52311430120603550408130b536f757468204b6f726561311330110603550407130a5375776f6e2043697479311c301a060355040a131353616d73756e6720436f72706f726174696f6e310c300a060355040b1303444d43311530130603550403130c53616d73756e6720436572743125302306092a864886f70d0109011616616e64726f69642e6f734073616d73756e672e636f6d820900d20995a79c0daad6300c0603551d13040530030101ff300d06092a864886f70d01010505000382010100329601fe40e036a4a86cc5d49dd8c1b5415998e72637538b0d430369ac51530f63aace8c019a1a66616a2f1bb2c5fabd6f313261f380e3471623f053d9e3c53f5fd6d1965d7b000e4dc244c1b27e2fe9a323ff077f52c4675e86247aa801187137e30c9bbf01c567a4299db4bf0b25b7d7107a7b81ee102f72ff47950164e26752e114c42f8b9d2a42e7308897ec640ea1924ed13abbe9d120912b62f4926493a86db94c0b46f44c6161d58c2f648164890c512dfb28d42c855bf470dbee2dab6960cad04e81f71525ded46cdd0f359f99c460db9f007d96ce83b4b218ac2d82c48f12608d469733f05a3375594669ccbf8a495544d6c5701e9369c08c810158") 
    };


// 0000 > a > i.class
    // ??? Nothing
    
// 0000 > a > j.class
    // ??? Nothing
    com.samsung.android.hmt
  
```

**Overall purpose**: handle trusted software updates.

## 0000 > b 

```

// 0000 > b > a.class
    // ~ Dynamic library version query?
    
// 0000 > b > b.class
    // ~ Dynamic library loader?    
    
// 0000 > b > c.class
    // ~ Mechanism to force-close app on non-Samsung devices
    // https://androidcommunity.com/samsung-gear-app-force-closes-on-non-samsung-devices-20170131/
    // "com.samsung.android.feature.FloatingFeature"
    
// 0000 > b > b.class
    // ~ File loader    

```

**Overall purpose**: use third-party code.

## 0000 > c

**Overall purpose**: MSM = Media State Machine ??? decode byte arrays received as data from the controller.
Memory mapped device interface --> provides interface `com.samsung.android.app.vr.input.service/unknown/com/samsung/android/app/vr/input/service/IRemoteInterface.aidl`

## 0000 > protocol

**Overall purpose**: Control everything and receive data

### 0000 > protocol > a

```

// Suspect 0000 > protocol > a > a is "BLEUCommonManager" package
    // BLE (Bluetooth Low Energy) connection boilerplate code (adapter, GATT, connection, pairing, etc.)

```

```

https://github.com/gb2111/Access-GearVR-Controller-from-PC

Write characteristics (hex values e.g. "0900" = send "0x0900" to the CUSTOM_SERVICE write characteristic)
    
    "0000" = Turn all special modes off (either in VR mode or in Sensor mode)
    
    "0100" = Sensor mode 
             Send touchpad and buttons data but update at lower rate
             0000 > protocol > a > o.class
    
    "0200" = ??? initiate firmware upgrade sequence?
    
    "0300" = Calibration mode 
             0000 > protocol > a > n.class 

    "0400" = Keep-alive command
             0000 > protocol > a > p.class

    "0500" = Setting mode (???)
             0000 > protocol > a > m.class 
    
    
    "0600" = LPM Enable (LPM = ???)
             0000 > protocol > a > k.class 
    "0700" = LPM Disable 
             0000 > protocol > a > j.class

    "0800" = VR Mode Enable 
             high frequency event data update ???
             0000 > protocol > a > l.class

```

### 0000 > protocol > ui > c.class

Pretty sure the structure of the event data is completely revealed here.

### 0000 > protocol > C0072f.java

Calibration code for sensor fusion...

- https://github.com/psiphi75/ahrs/issues/5
- https://electronics.stackexchange.com/questions/111530/ahrs-algorithm-under-continuous-linear-accelerations
- https://www.youtube.com/watch?v=g1q2Gat-yJo
- https://josephmalloch.wordpress.com/portfolio/imu-sensor-fusion/
- http://x-io.co.uk/open-source-imu-and-ahrs-algorithms/
- https://developer.oculus.com/blog/sensor-fusion-keeping-it-simple/
  - yaw error
  - yaw drift
- https://en.wikipedia.org/wiki/Azimuth
- https://bitbucket.org/alberto_pretto/imu_tk
- https://www.reddit.com/r/AskElectronics/comments/6yhevb/huge_drift_in_imu_orientation_estimation/
- https://www.reddit.com/r/nicechips/comments/6jk56i/request_easily_available_imu_with_welldocumented/
-  
