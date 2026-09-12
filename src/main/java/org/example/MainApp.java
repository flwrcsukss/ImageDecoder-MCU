package org.example;

import javafx.application.Application;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;
import java.net.URL;

public class MainApp extends Application {
    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();
        webEngine.setJavaScriptEnabled(true);

        URL url = getClass().getResource("/webapp/index.html");
        webEngine.load(url.toExternalForm());

        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {
            if (newState == Worker.State.SUCCEEDED) {
                JSObject window = (JSObject) webEngine.executeScript("window");

                BridgeCommands bridge = new BridgeCommands();
                bridge.setWebEngine(webEngine); // 👈 ПЕРЕДАЕМ

                window.setMember("bridge", bridge);
                System.out.println("Bridge Registered!");
            }
        });

        stage.setTitle("Bridge between Java and JavaScript");
        stage.setWidth(800);
        stage.setHeight(600);
        stage.setScene(new Scene(webView));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}