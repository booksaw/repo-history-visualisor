package com.example.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.AppProperties;
import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import jakarta.annotation.Resource;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.TransportException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class GitCloneServiceTest {

    @Mock
    Git git;

    @Mock
    private GitService gitService;

    @Autowired
    private AppProperties properties;

    private GitCloneService gitCloneService;

    @BeforeEach
    public void beforeEach() {
        gitCloneService = new GitCloneService(gitService, properties);
    }

    @AfterEach
    public void afterEach() {
        Mockito.reset(gitService);
    }

    @Test
    public void testCreatingService() {
        assertThat(gitCloneService).isNotNull();
    }

    @Test
    public void testGetExistingRepositoryOrNull() throws IOException, IllegalURLException {

        Mockito.doReturn(git).when(gitService).getLocalRepository(ArgumentMatchers.any());

        var gitRepo = gitCloneService.getExistingRepositoryOrNull("https://github.com");

        Assertions.assertEquals(gitRepo, git);

    }

    @Test
    public void testGetExistingRepositoryOrNullInvalidURL() throws IOException {

        Mockito.doReturn(git).when(gitService).getLocalRepository(ArgumentMatchers.any());

        Assertions.assertThrows(IllegalURLException.class, () -> {
            gitCloneService.getExistingRepositoryOrNull("test");
        });
    }

    @Test
    public void testGetExistingRepositoryOrNullGetNull() throws IOException, IllegalURLException {
        Mockito.doThrow(new IOException()).when(gitService).getLocalRepository(ArgumentMatchers.any());

        var gitRepo = gitCloneService.getExistingRepositoryOrNull("https://github.com");

        Assertions.assertNull(gitRepo);
    }

    @Test
    public void testGetUpToDateRepositoryOrCloneInvalidURL() throws IOException, IllegalCloneException {

        Mockito.doThrow(new IOException()).when(gitService).getLocalRepository(ArgumentMatchers.any());

        Assertions.assertThrows(IllegalCloneException.class, () -> {
            gitCloneService.getUpToDateRepositoryOrClone("test");
        });
    }

    @Test
    public void testGetUpToDateRepositoryOrCloneExistingRepo() throws IOException, IllegalCloneException {
        Mockito.doReturn(git).when(gitService).getLocalRepository(ArgumentMatchers.any());

        var gitRepo = gitCloneService.getUpToDateRepositoryOrClone("https://github.com");

        Assertions.assertEquals(gitRepo, git);

    }

    @Test
    public void testGetUpToDateRepositoryOrCloneCloneRepo() throws IOException, IllegalCloneException, GitAPIException {
        Mockito.doReturn(null).when(gitService).getLocalRepository(ArgumentMatchers.any());
        Mockito.doReturn(git).when(gitService).cloneRepositoryToDirectory(ArgumentMatchers.any(), ArgumentMatchers.any(), ArgumentMatchers.anyBoolean());

        var gitRepo = gitCloneService.getUpToDateRepositoryOrClone("https://github.com.git");

        Assertions.assertEquals(gitRepo, git);
    }

    @Test
    public void testCloneRepository() throws IOException, GitAPIException {
        Mockito.doReturn(null).when(gitService).getLocalRepository(ArgumentMatchers.any());
        Mockito.doThrow(new TransportException("")).when(gitService)
                .cloneRepositoryToDirectory(
                        ArgumentMatchers.any(),
                        ArgumentMatchers.any(),
                        ArgumentMatchers.anyBoolean()
                );

        Assertions.assertThrows(IllegalCloneException.class, () -> {
            gitCloneService.cloneRepository("test");
        });

    }

}
