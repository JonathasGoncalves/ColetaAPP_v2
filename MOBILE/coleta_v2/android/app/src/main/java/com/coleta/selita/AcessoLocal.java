package com.selita.coleta;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.FileWriter;
import java.io.OutputStream;
import android.app.Activity;
import android.os.Environment;

public class AcessoLocal extends ReactContextBaseJavaModule {
  AcessoLocal(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "AcessoLocal";
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String gerarID() {
    String uniqueID = UUID.randomUUID().toString();
    return uniqueID;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
    String save_file_bkp(String dados, String file_name) {
    // Create a path where we will place our private file on external
    // storage.
        try {
            String storageState = Environment.getExternalStorageState();
            if (storageState.equals(Environment.MEDIA_MOUNTED)) {
                final Activity activity = getCurrentActivity();
                File file = new File(activity.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), file_name);
                OutputStream os = new FileOutputStream(file);
                byte[] data = dados.getBytes();
                os.write(data);
                os.close();
            }
            return "1";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
   public String ExcluirArquivos() {
       try {
            String storageState = Environment.getExternalStorageState();
            if (storageState.equals(Environment.MEDIA_MOUNTED)) {
                final Activity activity = getCurrentActivity();
                File file_dir = new File(activity.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "file_name.txt");
                String path = file_dir.getAbsolutePath();
                String[] parts = path.split("/");
                String dir = "";
                for (int i = 0; i < (parts.length -1); i++)
                {
                    dir += parts[i] + "/";
                }
                File directory = new File(dir);
                
                File[] files = directory.listFiles();
                for (int i = 0; i < files.length; i++)
                {
                    File file = new File(dir, files[i].getName());
                    Long lastmodified = file.lastModified();
                    int MAXFILEAGE = 669600000; //7 DIAS EM MILISSEGUNDOS
                    if(lastmodified+MAXFILEAGE < System.currentTimeMillis()) { // SE TIVER MAIS DE 7 DIAS, DELETA
                      file.delete();
                    }
                }
                return "1";
            } else {
                return "Localização indisponivel!";
            }
            //return "1";
           
       }catch (Exception e) {
            return e.getMessage();
       } 
   }



}