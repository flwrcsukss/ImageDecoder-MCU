package org.example;

import javafx.scene.web.WebEngine;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import com.google.gson.Gson;

public class BridgeCommands {

    //    private javafx.scene.web.WebEngine webEngine;
    private Gson gson = new Gson();
    private WebEngine webEngine = new WebEngine();


    public void setWebEngine(WebEngine engine) {
        this.webEngine = engine;
    }


    public void generatePixels(int startX, int startY,
                               int height, int width,
                               int pixelStep, BufferedImage image,
                               String colorFormat, String strTemplate) {
        ArrayList<List> pixelList = new ArrayList<>();

        for (int y = startY; y < height; y += pixelStep) {
            for (int x = startX; x < width; x += pixelStep) {
                int pixel = image.getRGB(x, y);

                List<Integer> currentPixels = List.of(
                        x / pixelStep + startX,
                        y / pixelStep + startY,
                        (pixel >> 24) & 0xFF,   //a
                        (pixel >> 16) & 0xFF,   //r
                        (pixel >> 8) & 0xFF,    //g
                        (pixel) & 0xFF);    //b

                pixelList.add(currentPixels);

                if (pixelList.size() == 100) {
                    List<String> transmitHTML = new ArrayList<>();
                    switch (colorFormat) {
                        case "rgb":
                            for (int i = 0; i < pixelList.size(); i++) {
                                List currPixel = pixelList.get(i);
                                String stringHTML = strTemplate
                                        .replace("{x}", currPixel.get(0).toString())
                                        .replace("{y}", currPixel.get(1).toString())
                                        .replace("{color}", String.format("%02X%02X%02X",
                                                currPixel.get(3), currPixel.get(4), currPixel.get(5)));
                                transmitHTML.add(stringHTML);
                            }
                            String htmlJson = gson.toJson(transmitHTML);
                            webEngine.executeScript("writeCode(" + htmlJson + ");");
                            transmitHTML.clear();
                    }
                    String json = gson.toJson(pixelList);
                    webEngine.executeScript("writePixels(" + json + ");");
                    if (colorFormat == "rgb") {

                    }
                    pixelList.clear();
                }
            }
        }
    }


    public void generatePicture(String strTemplate,
                                     String colorFormat,
                                     int pixelStep,
                                     int startX,
                                     int startY,
                                     String imgBase64) {



        try {
            if (imgBase64 == null || imgBase64.length() == 0) {
                System.out.println("imgBase is null or len is 0");
                webEngine.executeScript("clearCode()");
            }

            String imgBase64Copy = imgBase64.contains(",")
                    ? imgBase64.substring(imgBase64.indexOf(",") + 1)
                    : imgBase64;

            byte[] imageBytes = Base64.getDecoder().decode(imgBase64Copy);

            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            BufferedImage image = ImageIO.read(bis);

            int width = image.getWidth();
            int height = image.getHeight();

            try {
                webEngine.executeScript("setSizeCanvas(" + width / pixelStep + ", " +
                        height / pixelStep + ", " + startX + ", " + startY + ");");

                generatePixels(startX, startY, height, width, pixelStep, image, colorFormat, strTemplate);
            }
            catch (Exception e) {
                System.out.println(e);
            }

        } catch (IOException e) {
            System.out.println("exception ImageIO");
        }

        catch (Exception e) {
            System.out.println("Other exception: " + e.getMessage());
        }


//        System.out.println(pixelList);
//        return pixelList;
    }


    public String consoleMess(String mess) {
        System.out.println(mess);
        return mess;
    }


    public void conJavaMess(String mess) {
        System.out.println(mess);
    }

}

