package com.bangur

import android.content.Context
import android.util.Log
import java.io.IOException
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor

class SSLPinningClient(context: Context) {
    private val client: OkHttpClient

    init {
        val hostname = "apisheecementuat.mjunction.in"

        val certificatePinner =
                CertificatePinner.Builder()
                        .add(hostname, "sha256/UvVQCYbTtiOChjyEmasVWFI2arIt406Z9tmpPZSjsos=")
                        .add(hostname, "sha256/E3tYcwo9CiqATmKtpMLW5V+pzIq+ZoDmpXSiJlXGmTo=")
                        .add(hostname, "sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=")
                        .build()

        client =
                OkHttpClient.Builder()
                        .certificatePinner(certificatePinner)
                        .addInterceptor(
                                HttpLoggingInterceptor().apply {
                                    level = HttpLoggingInterceptor.Level.BODY
                                }
                        )
                        .build()
    }

    @Throws(IOException::class)
    fun makeRequest(url: String): Response {
        try {
            val request = Request.Builder().url(url).build()
            return client.newCall(request).execute()
        } catch (e: Exception) {
            Log.e("EXCEPTION THROWN::: ", "Whatever", e)
            throw e
        }
    }
}
