package ru.bureau.otherlives;

import android.content.Intent;
import android.net.Uri;
import android.app.Instrumentation;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.*;
import android.webkit.WebView;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Real WebView acceptance; run on an emulator/device without any application network permission. */
@SuppressWarnings("deprecation")
public final class OfflineSmokeTest {
    private MainActivity activity;
    private WebView web;

    private Instrumentation getInstrumentation() { return InstrumentationRegistry.getInstrumentation(); }
    @Before public void setUp() throws Exception {
        assertTrue("Never reset the product package",getInstrumentation().getTargetContext().getPackageName().endsWith(".debug"));
        Intent intent = new Intent(getInstrumentation().getTargetContext(), MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity = (MainActivity)getInstrumentation().startActivitySync(intent);
        web = activity.findViewById(R.id.bureau_webview);
        long deadline = System.currentTimeMillis() + 30000;
        while (!"true".equals(js("typeof window.bureauAndroidBack==='function'"))) {
            if (System.currentTimeMillis() > deadline) fail("Packaged application did not load offline");
            Thread.sleep(150);
        }
    }
    private String js(String source) throws Exception {
        CountDownLatch latch = new CountDownLatch(1); String[] response = {null};
        getInstrumentation().runOnMainSync(() -> web.evaluateJavascript(source, value -> { response[0] = value; latch.countDown(); }));
        assertTrue("WebView response timeout", latch.await(10, TimeUnit.SECONDS));
        return response[0];
    }
    private void click(String selector) throws Exception { js("document.querySelector('" + selector + "').click()"); }
    private void reload(boolean reset) throws Exception {
        js("window.__bureauTestOldDocument=true;"+(reset?"localStorage.clear();":"")+"location.reload()");
        long deadline=System.currentTimeMillis()+30000;
        while(!"true".equals(js("window.__bureauTestOldDocument!==true && typeof window.bureauAndroidBack==='function' && !!document.querySelector('#main').firstElementChild"))) {
            if(System.currentTimeMillis()>deadline)fail("New document did not finish loading");Thread.sleep(150);
        }
    }

    @Test public void testOfflineMissionDiaryReloadAndBack() throws Exception {
        reload(true);
        long deadline=System.currentTimeMillis()+20000;
        while (!"true".equals(js("!!document.querySelector('[data-action=surprise]')"))) {
            if(System.currentTimeMillis()>deadline)fail("Home did not reload");Thread.sleep(150);
        }
        assertEquals("true", js("!!window.BureauAndroid && !document.querySelector('#home-time')"));
        click("[data-action=surprise]");
        assertEquals("true", js("document.querySelector('#detail-dialog').open"));
        click("[data-action=begin]");
        assertEquals("true", js("JSON.parse(localStorage.getItem('other-lives:state:v1')).active!==null"));
        click("[data-action=feedback]");
        js("document.querySelector('input[name=rating][value=\"5\"]').checked=true;document.querySelector('#feedback-note').value='Android offline test';document.querySelector('#feedback-form').requestSubmit()");
        assertEquals("true", js("document.querySelector('#main').innerText.includes('Android offline test')"));
        reload(false);
        assertEquals("true", js("JSON.parse(localStorage.getItem('other-lives:state:v1')).entries[0].note==='Android offline test'"));
        click("[data-action=settings]");
        assertEquals("true", js("document.querySelector('#dialog-content').innerText.includes('Android " + BuildConfig.VERSION_NAME.replace("-debug", "") + "')"));
        assertEquals("true", js("window.bureauAndroidBack()"));
        assertEquals("false", js("document.querySelector('#detail-dialog').open"));
        js("location.hash='friends'");Thread.sleep(150);
        assertEquals("true",js("window.bureauAndroidBack()"));
        assertEquals("\"#home\"",js("location.hash"));
    }
    @Test public void testOriginAndExternalDestinationBoundaries() {
        assertTrue(MainActivity.isLocal(Uri.parse("https://appassets.androidplatform.net/assets/index.html")));
        assertFalse(MainActivity.isLocal(Uri.parse("https://appassets.androidplatform.net.evil/assets/index.html")));
        assertFalse(MainActivity.isLocal(Uri.parse("file:///etc/passwd")));
        for(String url:new String[]{"javascript:alert(1)","intent://example.com", "https://example.com/assets/index.html", "https://appassets.androidplatform.net:443/assets/index.html"}) assertFalse(url,MainActivity.isLocal(Uri.parse(url)));
    }
    @Test public void testShareChooserUsesBundledPublicMissionOnly() throws Exception {
        Intent chooser=MainActivity.missionShareIntent(activity,"quiet-tea");
        assertEquals(Intent.ACTION_CHOOSER,chooser.getAction());
        Intent send=chooser.getParcelableExtra(Intent.EXTRA_INTENT);
        assertNotNull(send);
        assertEquals(Intent.ACTION_SEND,send.getAction());
        assertEquals("text/plain",send.getType());
        assertNull(send.getPackage());
        assertNull(send.getData());
        assertFalse(send.hasExtra(Intent.EXTRA_STREAM));
        assertEquals(3,send.getExtras().size());
        assertTrue(send.getStringExtra(Intent.EXTRA_TEXT).endsWith("\nhttps://tamagochigit.github.io/bureau-other-lives/?mission=quiet-tea#missions"));
        for(String id:new String[]{"unknown-mission","javascript:alert(1)","PRIVATE NOTE", "https://example.com"}) {
            try { MainActivity.missionShareIntent(activity,id); fail("Unknown mission must not open a chooser: "+id); }
            catch(IllegalArgumentException expected) { /* No outgoing intent for untrusted input. */ }
        }
    }
    @After public void tearDown() throws Exception {
        if(activity!=null)getInstrumentation().runOnMainSync(activity::finish);
    }
}
