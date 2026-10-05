package ru.bureau.otherlives;

import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.RenderProcessGoneDetail;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.view.WindowInsets;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Collections;
import org.json.JSONObject;

/** Only packaged application assets can execute; the bridge has one exact HTTPS origin. */
public final class MainActivity extends ComponentActivity {
    static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int EXPORT = 41, IMPORT = 42, MAX_BYTES = 32_000_000;
    private WebView webView;
    private JavaScriptReplyProxy pendingReply;
    private String pendingExport;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(247, 245, 240));
        webView = new WebView(this);
        webView.setId(R.id.bureau_webview);
        webView.setBackgroundColor(Color.rgb(247, 245, 240));
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        root.requestApplyInsets();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBlockNetworkLoads(true);
        settings.setSafeBrowsingEnabled(true);
        settings.setTextZoom(Math.max(100, Math.min(200, Math.round(getResources().getConfiguration().fontScale * 100))));
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClientCompat() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isLocal(uri)) {
                    WebResourceResponse response = loader.shouldInterceptRequest(uri);
                    if (response != null) return response;
                }
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (isLocal(request.getUrl())) return false;
                if (request.hasGesture()) openTelegram(request.getUrl());
                return true;
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                Toast.makeText(MainActivity.this, "Окно приложения перезапущено. Сохранённые записи остались.", Toast.LENGTH_LONG).show();
                recreate();
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setTitle("Бюро").setMessage(message)
                    .setPositiveButton("Да", (dialog, which) -> result.confirm())
                    .setNegativeButton("Отмена", (dialog, which) -> result.cancel())
                    .setOnCancelListener(dialog -> result.cancel()).show();
                return true;
            }
            @Override public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setTitle("Бюро").setMessage(message)
                    .setPositiveButton("Понятно", (dialog, which) -> result.confirm())
                    .setOnCancelListener(dialog -> result.cancel()).show();
                return true;
            }
        });
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            new AlertDialog.Builder(this).setTitle("Обнови Android System WebView")
                .setMessage("Для дневника и переноса записей нужна современная версия WebView. После обновления открой Бюро снова.")
                .setPositiveButton("Закрыть", (dialog, which) -> finish()).setCancelable(false).show();
            return;
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) WebViewCompat.addWebMessageListener(webView, "BureauAndroid", Collections.singleton(ORIGIN),
            (view, message, sourceOrigin, isMainFrame, reply) -> {
                if (!isMainFrame || !ORIGIN.equals(sourceOrigin.toString())) return;
                try {
                    String data = message.getData();
                    if (data == null || data.length() > MAX_BYTES + 2_000_000) throw new IllegalArgumentException();
                    JSONObject request = new JSONObject(data);
                    switch (request.getString("type")) {
                        case "export" -> chooseExport(request.getString("text"), reply);
                        case "import" -> chooseImport(reply);
                        case "open-url" -> openTelegram(Uri.parse(request.getString("url")));
                        default -> respond(reply, "status", "Неизвестное действие.", false);
                    }
                } catch (Exception error) { respond(reply, "status", "Не удалось выполнить действие.", false); }
            });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() { handleBack(); }
        });
        webView.loadUrl(ORIGIN + "/assets/index.html#home");
    }

    static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
            && uri.getUserInfo() == null && uri.getPort() == -1 && uri.getPath() != null && uri.getPath().startsWith("/assets/");
    }
    static boolean isTelegram(Uri uri) {
        return "https".equals(uri.getScheme()) && "t.me".equals(uri.getHost()) && uri.getUserInfo() == null
            && uri.getPort() == -1 && uri.getFragment() == null && uri.toString().length() <= 12_000
            && uri.getPath() != null && (uri.getPath().matches("/[A-Za-z][A-Za-z0-9_]{3,31}") || "/share/url".equals(uri.getPath()));
    }
    private void openTelegram(Uri uri) {
        if (!isTelegram(uri)) { Toast.makeText(this, "Эта ссылка недоступна.", Toast.LENGTH_SHORT).show(); return; }
        try { startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (ActivityNotFoundException error) { Toast.makeText(this, "Установи Telegram или браузер, чтобы открыть переписку.", Toast.LENGTH_LONG).show(); }
    }
    private void chooseExport(String text, JavaScriptReplyProxy reply) {
        if (pendingReply != null) { respond(reply, "status", "Сначала закончи работу с предыдущим файлом.", false); return; }
        if (text.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES) { respond(reply, "status", "Копия превышает 32 МБ.", false); return; }
        pendingReply = reply; pendingExport = text;
        try {
            startActivityForResult(new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                .setType("application/json").putExtra(Intent.EXTRA_TITLE, "bureau-diary-" + LocalDate.now() + ".json"), EXPORT);
        } catch (ActivityNotFoundException error) { finishFile("На устройстве нет приложения для сохранения файлов.", false); }
    }
    private void chooseImport(JavaScriptReplyProxy reply) {
        if (pendingReply != null) { respond(reply, "status", "Сначала закончи работу с предыдущим файлом.", false); return; }
        pendingReply = reply;
        try { startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*")
            .putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"}), IMPORT); }
        catch (ActivityNotFoundException error) { finishFile("На устройстве нет приложения для выбора файлов.", false); }
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != EXPORT && requestCode != IMPORT) return;
        if (pendingReply == null) { Toast.makeText(this, "Открой перенос дневника ещё раз.", Toast.LENGTH_SHORT).show(); return; }
        if (resultCode != RESULT_OK || data == null || data.getData() == null) { finishFile("Выбор файла отменён.", false); return; }
        Uri uri = data.getData();
        JavaScriptReplyProxy reply = pendingReply;
        String text = pendingExport;
        // Providers can be remote or slow; never block the Android UI while reading/writing.
        new Thread(() -> {
            try {
                if (requestCode == EXPORT) {
                    try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                        if (out == null) throw new IllegalStateException();
                        out.write(text.getBytes(StandardCharsets.UTF_8));
                    }
                    runOnUiThread(() -> finishFile("Копия дневника сохранена.", true));
                } else {
                    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
                    try (InputStream in = getContentResolver().openInputStream(uri)) {
                        if (in == null) throw new IllegalStateException();
                        byte[] buffer = new byte[8192]; int read;
                        while ((read = in.read(buffer)) != -1) {
                            if (bytes.size() + read > MAX_BYTES) throw new IllegalArgumentException("Файл слишком большой. Максимум — 32 МБ.");
                            bytes.write(buffer, 0, read);
                        }
                    }
                    String raw = new String(bytes.toByteArray(), StandardCharsets.UTF_8);
                    runOnUiThread(() -> { pendingReply = null; pendingExport = null; respond(reply, "import", raw, true); });
                }
            } catch (Exception error) {
                String failure = error instanceof IllegalArgumentException ? error.getMessage() : "Не удалось прочитать или сохранить файл. Дневник остался на устройстве.";
                runOnUiThread(() -> finishFile(failure, false));
            }
        }, "bureau-file").start();
    }
    private void finishFile(String message, boolean success) {
        JavaScriptReplyProxy reply = pendingReply;
        pendingReply = null; pendingExport = null;
        if (reply != null) respond(reply, "status", message, success);
    }
    private static void respond(JavaScriptReplyProxy reply, String type, String text, boolean success) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) return;
        try { reply.postMessage(new JSONObject().put("type", type).put("text", text).put("ok", success).toString()); }
        catch (Exception ignored) { /* A destroyed page cannot receive a file-picker result. */ }
    }
    private void handleBack() {
        webView.evaluateJavascript("typeof window.bureauAndroidBack==='function' && window.bureauAndroidBack()", value -> {
            if (!"true".equals(value)) finish();
        });
    }
    @Override protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
}
