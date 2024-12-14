package com.bangur.ssl

import android.app.Activity
import android.content.Context
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.InputStream
import java.security.KeyStore
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSession
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager
import okhttp3.OkHttpClient
import okhttp3.Request

class SslPinningModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SslPinningModule"
    }

    @ReactMethod
    fun validateServerCertificate(serverUrl: String, callback: Callback) {
        try {
            // Load your pinned certificate
            val context: Context = reactApplicationContext
            val certificateFactory = CertificateFactory.getInstance("X.509")
            val certificateInputStream: InputStream = context.assets.open("mjunction_combined.cer")
            val pinnedCertificate: X509Certificate =
                    certificateFactory.generateCertificate(certificateInputStream) as
                            X509Certificate
            certificateInputStream.close()

            // Initialize TrustManager with your certificate
            val keyStore =
                    KeyStore.getInstance(KeyStore.getDefaultType()).apply {
                        load(null)
                        setCertificateEntry("pinned_cert", pinnedCertificate)
                    }
            val trustManagerFactory =
                    TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
            trustManagerFactory.init(keyStore)
            val trustManagers = trustManagerFactory.trustManagers
            val x509TrustManager = trustManagers[0] as X509TrustManager

            // Set up SSLContext
            val sslContext =
                    SSLContext.getInstance("TLS").apply {
                        init(null, arrayOf(x509TrustManager), null)
                    }

            // Create OkHttpClient with SSLContext
            val client =
                    OkHttpClient.Builder()
                            .sslSocketFactory(sslContext.socketFactory, x509TrustManager)
                            .hostnameVerifier { _: String?, session: SSLSession ->
                                val serverCertificate =
                                        session.peerCertificates[0] as X509Certificate
                                serverCertificate == pinnedCertificate
                            }
                            .build()

            // Make a request to validate the server's certificate
            val request = Request.Builder().url(serverUrl).build()
            val response = client.newCall(request).execute()

            if (response.isSuccessful) {
                callback.invoke(null, "Certificate matches!")
            } else {
                callback.invoke("Certificate mismatch. Closing app.")
                closeApp()
            }
        } catch (e: Exception) {
            callback.invoke("Error validating certificate: ${e.message}")
            closeApp()
        }
    }

    private fun closeApp() {
        val activity: Activity? = currentActivity
        activity?.finish()
    }
}
