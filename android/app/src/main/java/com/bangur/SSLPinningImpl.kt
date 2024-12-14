import android.content.Context
import java.io.InputStream
import java.security.KeyStore
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManagerFactory
import okhttp3.OkHttpClient
import okhttp3.Request

fun getPinnedHttpClient(context: Context): OkHttpClient {
    // Load the embedded certificate from res/raw
    val certificateFactory = CertificateFactory.getInstance("X.509")
    val certificateInputStream: InputStream = context.assets.open("mjunction_combined.cer")
    val certificate: X509Certificate =
            certificateFactory.generateCertificate(certificateInputStream) as X509Certificate
    certificateInputStream.close()

    // Create a KeyStore containing the trusted certificate
    val keyStore =
            KeyStore.getInstance(KeyStore.getDefaultType()).apply {
                load(null) // Initialize an empty KeyStore
                setCertificateEntry("server", certificate)
            }

    // Create a TrustManager that trusts the certificate in the KeyStore
    val trustManagerFactory =
            TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
    trustManagerFactory.init(keyStore)

    // Create an SSLContext with the TrustManager
    val sslContext =
            SSLContext.getInstance("TLS").apply {
                init(null, trustManagerFactory.trustManagers, null)
            }

    // Build an OkHttpClient with the SSLContext
    return OkHttpClient.Builder()
            .sslSocketFactory(
                    sslContext.socketFactory,
                    trustManagerFactory.trustManagers[0] as javax.net.ssl.X509TrustManager
            )
            .build()
}

fun makeSecureRequest(context: Context) {
    val client = getPinnedHttpClient(context)

    val request = Request.Builder().url("https://apisheecementuat.mjunction.in").build()

    val response = client.newCall(request).execute()
    if (response.isSuccessful) {
        println("Responses: ${response.body?.string()}")
    } else {
        println("Failed: ${response.code}")
    }
}
