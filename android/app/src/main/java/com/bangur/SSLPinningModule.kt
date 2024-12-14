package com.bangur

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SSLPinningModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    private val sslClient = SSLPinningClient(reactContext)

    override fun getName(): String {
        return "SSLPinning"
    }

    @ReactMethod
    fun detectFridaPresence(): Boolean {
        val knownFridaProcesses = listOf("frida-server", "frida-agent")
        val runtimeProcesses =
                Runtime.getRuntime().exec("ps").inputStream.bufferedReader().use { it.readText() }
        for (process in knownFridaProcesses) {
            if (runtimeProcesses.contains(process)) {
                return true // Frida detected in processes
            }
        }

        // Check for Frida libraries
        val mapsContent =
                Runtime.getRuntime().exec("cat /proc/self/maps").inputStream.bufferedReader().use {
                    it.readText()
                }
        if (mapsContent.contains("frida")) {
            return true // Frida library detected
        }

        // Check for suspicious system properties
        val properties =
                Runtime.getRuntime().exec("getprop").inputStream.bufferedReader().use {
                    it.readText()
                }
        if (properties.contains("frida")) {
            return true // Frida property detected
        }

        return false // No Frida detected
    }

    @ReactMethod
    fun makeRequest(url: String, promise: Promise) {
        try {
            val response = sslClient.makeRequest(url)
            promise.resolve(response.body?.string())
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
