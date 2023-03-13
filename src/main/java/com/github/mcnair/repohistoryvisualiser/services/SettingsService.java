package com.github.mcnair.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.repository.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

@Service
public class SettingsService {

    private YAMLService YAMLService;

    @Autowired
    public SettingsService(YAMLService YAMLService) {
        this.YAMLService = YAMLService;
    }

    public Settings manageSettings(String url) throws IllegalURLException {

        try {
            Settings settings = YAMLService.readYaml(new URL(url), Settings.class);
            return settings;
        } catch (IOException e) {
            throw new IllegalURLException(url, e);
        }
    }

}
