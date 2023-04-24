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
import com.github.mcnair.repohistoryvisualiser.repository.Structure;
import com.github.mcnair.repohistoryvisualiser.services.*;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.lib.Repository;
import org.hibernate.validator.internal.IgnoreForbiddenApisErrors;
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
import java.util.ArrayList;
import java.util.List;
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
    @Disabled("Disabled as test cannot run on GitHub actions")
    public void testLoadCommitData() throws IOException, RepositoryTraverseException, IllegalBranchException, GitAPIException, IllegalCloneException {
        var git = gitCloneService.getUpToDateRepositoryOrClone("https://github.com/booksaw/betterteams");

        List<Structure> structures = new ArrayList<>();
        Structure s1 = new Structure();
        s1.startCommitID = 0;
        s1.endCommitID = 2;
        s1.label = "structure1";
        s1.collapse = false;
        s1.folder = "folder";
        s1.startCommitHash = "A";
        s1.endCommitHash = "D";
        Structure s2 = new Structure();
        s2.startCommitID = 0;
        s2.endCommitID = 2;
        s2.collapse = true;
        s2.label = "structure2";
        s2.folder = "folder";
        s2.startCommitHash = "B";
        s2.endCommitHash = "C";
        Structure s3 = new Structure();
        s3.endCommitID = 2;
        s3.label = "structure3";
        s3.collapse = false;
        s3.folder = "folder";
        s3.endCommitHash = "C";
        structures.add(s1);
        structures.add(s2);
        structures.add(s3);

        Map<Integer, Commit> result = gitService.loadCommitData("https://github.com", git, "master", structures,0, 5);

        Assertions.assertEquals(result.get(0).getCommitHash(), "7879dbff13e16390b035fd9493dfdb2ae7fa405f");
    }

    @Test
    public void testLoadCommitDataInvalidBranch() throws IOException {

        var repository = Mockito.mock(Repository.class);
        Mockito.doReturn(null).when(repository).resolve(ArgumentMatchers.any());

        Mockito.doReturn(repository).when(git).getRepository();

        Assertions.assertThrows(IllegalBranchException.class, () -> {
            gitService.loadCommitData("https://github.com", git, "master", null, 0, 3);
        });
    }

    @Disabled("Disabled as test cannot run on GitHub actions")
    @Test
    public void testGettingRepositoryMetadata() throws IllegalCloneException, IllegalURLException, RepositoryTraverseException, IllegalBranchException {
        var git = gitCloneService.getUpToDateRepositoryOrClone("https://github.com/booksaw/PirateDucks");
        SettingsService settingsService = new SettingsService(new YAMLService(), new GitCloneService(new GitService(), new AppProperties()), new JSONService());
        var settings = settingsService.manageSettings("https://raw.githubusercontent.com/booksaw/repo-history-visualiser/master/exampleFiles/PirateDucksSettings.yaml");

        RepositoryMetadata result = gitService.getRepositoryMetadata("https://github.com", "main", git, settings);

        Assertions.assertTrue(result.totalCommits > 200);
    }

}
