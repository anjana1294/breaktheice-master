package com.breaktheice;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {

      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PhotoViewPackage(),
            new RNSoundPackage(),
            new RNFusedLocationPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new RCTMGLPackage(),
            new FIRMessagingPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }


  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
