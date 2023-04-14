package com.example.repohistoryvisualiser.api;

import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.api.APIController;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalBranchException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.exception.RepositoryTraverseException;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import com.github.mcnair.repohistoryvisualiser.services.SettingsService;
import com.github.mcnair.repohistoryvisualiser.services.URLService;
import org.eclipse.jgit.api.Git;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class APIControllerTests {

    @Mock
    private GitCloneService gitCloneService;

    @Mock
    private URLService urlService;

    @Mock
    private GitService gitService;

    @Mock
    private SettingsService settingsService;

    private APIController controller;

    @BeforeEach
    public void beforeEach() {
        controller = new APIController(gitCloneService, urlService, gitService, settingsService);
    }

    @AfterEach
    public void afterEach() {
        Mockito.reset(gitCloneService);
        Mockito.reset(urlService);
        Mockito.reset(gitService);
        Mockito.reset(settingsService);
    }

    @Test
    public void testAPICreation() {
        Assertions.assertNotNull(controller);
    }

    @Test
    public void testPrevisInvalidURL() throws IllegalCloneException {
        Mockito.when(gitCloneService.getUpToDateRepositoryOrClone(ArgumentMatchers.any())).thenThrow(new IllegalCloneException());

        var response = controller.prepareVisualisation("invalid", "master", null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testPrevisTraverseException() throws RepositoryTraverseException, IllegalBranchException {
        Mockito.when(
                        gitService.getRepositoryMetadata(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
                .thenThrow(new RepositoryTraverseException());

        var response = controller.prepareVisualisation("valid", "master", null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testPrevisIllegalBranch() throws RepositoryTraverseException, IllegalBranchException {
        Mockito.when(
                        gitService.getRepositoryMetadata(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any()))
                .thenThrow(new IllegalBranchException(""));

        var response = controller.prepareVisualisation("valid", "master", null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testPrevisIllegalSettings() throws IllegalURLException {
        Mockito.when(
                        settingsService.manageSettings(ArgumentMatchers.any()))
                .thenThrow(new IllegalURLException(""));

        var response = controller.prepareVisualisation("valid", "master", "settingsurl");

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testPrevis() {
        var response = controller.prepareVisualisation("valid", "master", "settingsurl");

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testCommitDataInvalidRepository() throws IllegalURLException {

        Mockito.when(gitCloneService.getExistingRepositoryOrNull(ArgumentMatchers.any()))
                .thenThrow(new IllegalURLException(""));

        var response = controller.commitData("invalid", "master", null, null, null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testCommitDataNoPrevis() throws IllegalURLException {

        Mockito.when(gitCloneService.getExistingRepositoryOrNull(ArgumentMatchers.any()))
                .thenReturn(null);

        var response = controller.commitData("valid", "master", null, null, null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testCommitDataTraverseException() throws RepositoryTraverseException, IllegalBranchException, IllegalURLException {

        var git = Mockito.mock(Git.class);
        Mockito.when(gitCloneService.getExistingRepositoryOrNull(ArgumentMatchers.any()))
                .thenReturn(git);

        Mockito.when(gitService.loadCommitData(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.anyInt(), ArgumentMatchers.anyInt()))
                .thenThrow(new RepositoryTraverseException());

        var response = controller.commitData("valid", "master", null, null, null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testCommitIllegalBranch() throws RepositoryTraverseException, IllegalBranchException, IllegalURLException {

        var git = Mockito.mock(Git.class);
        Mockito.when(gitCloneService.getExistingRepositoryOrNull(ArgumentMatchers.any()))
                .thenReturn(git);

        Mockito.when(gitService.loadCommitData(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.anyInt(), ArgumentMatchers.anyInt()))
                .thenThrow(new IllegalBranchException(""));

        var response = controller.commitData("valid", "master", null, null, null);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testCommitData() throws IllegalURLException {

        var git = Mockito.mock(Git.class);
        Mockito.when(gitCloneService.getExistingRepositoryOrNull(ArgumentMatchers.any()))
                .thenReturn(git);

        var response = controller.commitData("valid", "master", null,null, null);

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
