package com.example.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.repository.Settings;
import com.github.mcnair.repohistoryvisualiser.services.SettingsService;
import com.github.mcnair.repohistoryvisualiser.services.YAMLService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class SettingsServiceTest {

    @Mock
    private YAMLService yamlService;

    @InjectMocks
    @Resource
    private SettingsService settingsService;

    @BeforeEach
    public void beforeAll() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreatingService() {
        assertThat(yamlService).isNotNull();
    }

    @Test
    public void testManageSettings() throws IOException, IllegalURLException {

        var settings = new Settings();
        settings.structures = new ArrayList<>();

        Mockito.doReturn(settings).when(yamlService).readYaml(ArgumentMatchers.any(), ArgumentMatchers.any());

        var result = settingsService.manageSettings("https://github.com");

        Assertions.assertEquals(result, settings);

        Mockito.reset(yamlService);
    }

    @Test
    public void testProvidingInvalidURL() throws IOException {
        var settings = new Settings();
        settings.structures = new ArrayList<>();

        MockitoAnnotations.openMocks(this);
        Mockito.doThrow(new IOException()).when(yamlService).readYaml(ArgumentMatchers.any(), ArgumentMatchers.any());

        Assertions.assertThrows(IllegalURLException.class, () -> {
            settingsService.manageSettings("https://github.com");
        });

        Mockito.reset(yamlService);
    }

    @Test
    public void testGetSettingsFileIllegalURL() {
        Assertions.assertThrows(IllegalURLException.class, () -> {
            settingsService.getSettingsFile("{}", "{}");
        });
    }

    @Test
    public void testGetSettingsFile() throws IllegalURLException, IOException {

        var f = settingsService.getSettingsFile("https://testrepo", "https://settingsurl");
        Assertions.assertEquals(f.getPath(), "clonedRepositories" + File.separator + "testrepo" + File.separator + "settingsurl.json" );
    }

    @Test
    public void testSaveSettings() throws IllegalURLException, IOException {
        Settings settings = new Settings();

        Assertions.assertDoesNotThrow(() -> {
            settingsService.saveSettings("https://testrepo", "https://settingsurl", settings);
        });
    }

    @Test
    public void testLoadSettings() throws IllegalURLException, IOException {

        var settings = settingsService.loadSettings("https://testrepo", "https://settingsurl");
        Assertions.assertNotNull(settings);
    }
}
