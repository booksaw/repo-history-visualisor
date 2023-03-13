package com.example.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.AppProperties;
import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalBranchException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.exception.RepositoryTraverseException;
import com.github.mcnair.repohistoryvisualiser.repository.Commit;
import com.github.mcnair.repohistoryvisualiser.repository.FileChange;
import com.github.mcnair.repohistoryvisualiser.repository.RepositoryMetadata;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import com.github.mcnair.repohistoryvisualiser.services.SettingsService;
import com.github.mcnair.repohistoryvisualiser.services.YAMLService;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.lib.Repository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
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
import java.util.Map;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class GitServiceTest {

    @Mock
    Git git;

    @Autowired
    private GitService gitService;

    @Autowired
    private GitCloneService gitCloneService;

    @Test
    public void testGettingFileChangeA() {
        var changeType = GitService.getFileChangeType(DiffEntry.ChangeType.ADD);
        Assertions.assertEquals(changeType, FileChange.FileChangeType.A);
    }

    @Test
    public void testGettingFileChangeM() {
        var changeType = GitService.getFileChangeType(DiffEntry.ChangeType.MODIFY);
        Assertions.assertEquals(changeType, FileChange.FileChangeType.M);
    }

    @Test
    public void testGettingFileChangeD() {
        var changeType = GitService.getFileChangeType(DiffEntry.ChangeType.DELETE);
        Assertions.assertEquals(changeType, FileChange.FileChangeType.D);
    }

    @Test
    public void testGettingFileChangeNull() {
        var changeType = GitService.getFileChangeType(null);
        Assertions.assertEquals(changeType, FileChange.FileChangeType.A);
    }

    @Test
    @Disabled
    public void testLoadCommitData() throws IOException, RepositoryTraverseException, IllegalBranchException, GitAPIException, IllegalCloneException {
        var git = gitCloneService.getUpToDateRepositoryOrClone("https://github.com/booksaw/betterteams");

        Map<Integer, Commit> result = gitService.loadCommitData("https://github.com", git, "master", 0, 2);

        Assertions.assertEquals(result.get(0).getCommitHash(), "7879dbff13e16390b035fd9493dfdb2ae7fa405f");
    }

    @Test
    public void testLoadCommitDataInvalidBranch() throws IOException {

        var repository = Mockito.mock(Repository.class);
        Mockito.doReturn(null).when(repository).resolve(ArgumentMatchers.any());

        Mockito.doReturn(repository).when(git).getRepository();

        Assertions.assertThrows(IllegalBranchException.class, () -> {
            gitService.loadCommitData("https://github.com", git, "master", 0, 1);
        });
    }

    @Test
    @Disabled
    public void testGettingRepositoryMetadata() throws IllegalCloneException, IllegalURLException, RepositoryTraverseException, IllegalBranchException {
        var git = gitCloneService.getUpToDateRepositoryOrClone("https://github.com/booksaw/betterteams");
        SettingsService settingsService = new SettingsService(new YAMLService());
        var settings = settingsService.manageSettings("https://raw.githubusercontent.com/booksaw/repo-history-visualiser/master/exampleFiles/BetterTeamsSettings.yaml");

        RepositoryMetadata result = gitService.getRepositoryMetadata("https://github.com", "master", git, settings);

        Assertions.assertTrue(result.totalCommits > 600);
    }

}
