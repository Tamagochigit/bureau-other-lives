package ru.bureau.otherlives;

import android.app.Instrumentation;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.view.PixelCopy;
import android.webkit.WebView;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.ByteArrayOutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.json.JSONObject;

/** Captures actual Android window pixels. Demo records exist only in the separate debug package. */
@SuppressWarnings("deprecation")
public final class StoreScreenshotsTest {
    private MainActivity activity;
    private WebView web;
    private final Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();

    @Before public void start() throws Exception {
        assertTrue("Never clear the product package", instrumentation.getTargetContext().getPackageName().endsWith(".debug"));
        activity = (MainActivity)instrumentation.startActivitySync(new Intent(instrumentation.getTargetContext(), MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        web = activity.findViewById(R.id.bureau_webview);
        await("typeof window.bureauAndroidBack==='function'");
        js("window.__bureauTestOldDocument=true;localStorage.clear();location.hash='home';location.reload()");
        await("window.__bureauTestOldDocument!==true && typeof window.bureauAndroidBack==='function' && !!document.querySelector('[data-action=surprise]')");
        // Size a real emulator display so its app content is 9:16, without scaling/cropping the interface.
        for (int attempt=0; attempt<5; attempt++) {
            int[] size = new int[2];
            instrumentation.runOnMainSync(() -> {
                size[0]=web.getWidth();size[1]=web.getHeight();
            });
            if(size[0]==1080 && size[1]==1920)break;
            // Android 35 getRealSize can return compatibility window bounds, not wm override size.
            String display=shell("wm size");int width=0,height=0;
            Matcher matcher=Pattern.compile("(\\d+)x(\\d+)").matcher(display);
            while(matcher.find()) {width=Integer.parseInt(matcher.group(1));height=Integer.parseInt(matcher.group(2));}
            assertTrue("Shell display size: "+display,width>0 && height>0);
            System.out.println("Store viewport "+size[0]+"x"+size[1]+"; display "+width+"x"+height);
            shell("wm size "+(width+1080-size[0])+"x"+(height+1920-size[1]));
            Thread.sleep(1000);
        }
        instrumentation.runOnMainSync(() -> {assertEquals(1080,web.getWidth());assertEquals(1920,web.getHeight());});
    }
    private String shell(String command) throws Exception {
        try (ParcelFileDescriptor.AutoCloseInputStream stream=new ParcelFileDescriptor.AutoCloseInputStream(instrumentation.getUiAutomation().executeShellCommand(command))) {
            ByteArrayOutputStream output=new ByteArrayOutputStream();byte[] buffer=new byte[1024];int count;
            while((count=stream.read(buffer))!=-1)output.write(buffer,0,count);
            return output.toString("UTF-8");
        }
    }
    private String js(String source) throws Exception {
        CountDownLatch latch=new CountDownLatch(1);String[] response={null};
        instrumentation.runOnMainSync(()->web.evaluateJavascript(source,value->{response[0]=value;latch.countDown();}));
        assertTrue("WebView response",latch.await(10,TimeUnit.SECONDS));return response[0];
    }
    private void await(String condition) throws Exception {
        long deadline=System.currentTimeMillis()+30000;
        while(!"true".equals(js(condition))) {
            if(System.currentTimeMillis()>deadline)fail("UI condition: "+condition);
            Thread.sleep(150);
        }
    }
    private void click(String selector) throws Exception {js("document.querySelector("+JSONObject.quote(selector)+").click()");}
    private void navigate(String view) throws Exception {
        click("#navigation a[href='#"+view+"']");
        await("location.hash==="+JSONObject.quote("#"+view));
    }
    private void capture(String name) throws Exception {
        instrumentation.waitForIdleSync();Thread.sleep(250);
        Bitmap bitmap=Bitmap.createBitmap(1080,1920,Bitmap.Config.ARGB_8888);
        CountDownLatch latch=new CountDownLatch(1);int[] result={-1};
        instrumentation.runOnMainSync(()->{
            int[] position=new int[2];web.getLocationInWindow(position);
            Rect bounds=new Rect(position[0],position[1],position[0]+web.getWidth(),position[1]+web.getHeight());
            PixelCopy.request(activity.getWindow(),bounds,bitmap,value->{result[0]=value;latch.countDown();},new Handler(Looper.getMainLooper()));
        });
        assertTrue("PixelCopy completed",latch.await(10,TimeUnit.SECONDS));
        assertEquals("Actual window capture",PixelCopy.SUCCESS,result[0]);
        File directory=new File(activity.getExternalFilesDir(null),"store-screens");
        assertTrue(directory.isDirectory() || directory.mkdirs());
        bitmap.setHasAlpha(false);
        try(FileOutputStream stream=new FileOutputStream(new File(directory,name))) {
            assertTrue(bitmap.compress(Bitmap.CompressFormat.PNG,100,stream));
        }
        bitmap.recycle();
    }
    private void complete(String id,int rating,String note) throws Exception {
        navigate("missions");
        click("[data-action=mission][data-id="+id+"]");
        click("[data-action=begin]");
        for(int step=0;step<3;step++)click("[data-step='"+step+"']");
        click("[data-action=feedback]");
        js("document.querySelector('input[name=rating][value="+rating+"]').checked=true;document.querySelector('#feedback-note').value="+JSONObject.quote(note)+";document.querySelector('#feedback-form').requestSubmit()");
        await("document.querySelector('#main').innerText.includes("+JSONObject.quote(note)+")");
    }
    @Test public void captureCurrentProductScreens() throws Exception {
        Bitmap icon=Bitmap.createBitmap(512,512,Bitmap.Config.ARGB_8888);
        instrumentation.runOnMainSync(()->{
            Canvas canvas=new Canvas(icon);canvas.drawColor(0xff8a3112);
            android.graphics.drawable.Drawable door=activity.getDrawable(R.drawable.ic_door);
            assertNotNull(door);door.setBounds(0,0,512,512);door.draw(canvas);
        });
        icon.setHasAlpha(false);
        try(FileOutputStream stream=new FileOutputStream(new File(activity.getExternalFilesDir(null),"store-icon.png"))) {
            assertTrue(icon.compress(Bitmap.CompressFormat.PNG,100,stream));
        }
        icon.recycle();
        capture("01-home.png");
        navigate("missions");
        capture("02-missions.png");
        click("[data-action=mission][data-id=detail-hunter]");
        await("document.querySelector('#detail-dialog').open");
        capture("03-mission.png");
        click("[data-action=close-detail]");
        complete("detail-hunter",5,"Пример: заметил три детали привычного маршрута.");
        complete("quiet-tea",4,"Пример: десять спокойных минут за чашкой чая.");
        complete("home-radio",5,"Пример: собрал музыку и истории для своего эфира.");
        navigate("diary");
        capture("04-diary.png");
        navigate("compass");
        capture("05-compass.png");
    }
    @After public void stop() throws Exception {
        if(activity!=null) {
            js("localStorage.clear()");
            instrumentation.runOnMainSync(activity::finish);
        }
    }
}
