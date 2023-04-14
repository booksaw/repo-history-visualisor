package com.github.mcnair.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.repository.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Path;

@Service
public class SettingsService {

    private YAMLService YAMLService;
    private GitCloneService gitCloneService;
    private JSONService JSONService;

    @Autowired
    public SettingsService(YAMLService YAMLService, GitCloneService gitCloneService, JSONService jsonService) {
        this.YAMLService = YAMLService;
        this.gitCloneService = gitCloneService;
        this.JSONService = jsonService;
    }

    public Settings manageSettings(String url) throws IllegalURLException {

        try {
            Settings settings = YAMLService.readYaml(new URL(url), Settings.class);
            return settings;
        } catch (IOException e) {
            throw new IllegalURLException(url, e);
        }
    }

    public File getSettingsFile(String cloneURL, String settingsURL) throws IllegalURLException, IOException {
        File file = gitCloneService.getCloneFolder(cloneURL);

        String path;

        try {
            String settingsReplaced = settingsURL.replaceAll("/", "");
            URL url = new URL(settingsReplaced);
            path = url.getHost() + url.getPath() + ".json";
        } catch (MalformedURLException e) {
            throw new IllegalURLException(settingsURL, e);
        }

        File f = Path.of(file.getPath(), path).toFile();
        if(!f.exists()) {
            f.createNewFile();
        }
        return f;
    }

    public void saveSettings(String cloneURL, String settingsURL, Settings settings) throws IllegalURLException, IOException {

        File settingsFile = getSettingsFile(cloneURL, settingsURL);
        JSONService.writeJSON(settingsFile, settings);

    }

    public Settings loadSettings(String cloneURL, String settingsURL) throws IOException, IllegalURLException {

        File settingsFile = getSettingsFile(cloneURL, settingsURL);
        return JSONService.readJSON(settingsFile, Settings.class);

    }

}
