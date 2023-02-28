package com.github.mcnair.repohistoryvisualiser.api;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalBranchException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.exception.RepositoryTraverseException;
import com.github.mcnair.repohistoryvisualiser.repository.Commit;
import com.github.mcnair.repohistoryvisualiser.repository.RepositoryMetadata;
import com.github.mcnair.repohistoryvisualiser.repository.Settings;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import com.github.mcnair.repohistoryvisualiser.services.SettingsService;
import com.github.mcnair.repohistoryvisualiser.services.URLService;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class APIController {

    @Autowired
    private GitCloneService gitCloneService;

    @Autowired
    private URLService urlService;

    @Autowired
    private GitService gitService;

    @Autowired
    private SettingsService settingsService;

    /**
     * Used to clone a repository locally
     *
     * @param clone The repository to clone
     * @return The response to the request
     */
    @GetMapping("/commitdata")
    public ResponseEntity<?> showTestOutput(@RequestParam(name = "clone") String clone,
                                            @RequestParam(name = "branch") String branch,
                                            @RequestParam(value = "startCommit", required = false) Integer startCommit,
                                            @RequestParam(value = "commitCount", required = false) Integer commitCount) {

        log.info("Received request for API: /clone/{} with branch {}, startCommit = {}, commitCount = {}", clone, branch, startCommit, commitCount);

        if(startCommit == null) {
            startCommit = 0;
        }

        if (commitCount == null) {
            commitCount = 50;
        }

        // cloning the git repository locally
        Git git;
        try {
            git = gitCloneService.getExistingRepositoryOrNull(clone);
        } catch (IllegalURLException e) {
            log.error("Unable to clone repository, clone may be malformed or not exist. URL = '{}'", clone);
            return ResponseEntity.badRequest().body("Invalid repository clone URL");
        }


        if(git == null) {
            return ResponseEntity.badRequest().body("You must call the /previs endpoint before you can begin the visualisation");
        }

        // processing the git repository to get the data required
        Map<Integer, Commit> commits;
        try {
            commits = gitService.loadCommitData(clone, git, branch, startCommit, commitCount);
        } catch (RepositoryTraverseException e) {
            log.error("Unable to traverse repository with clone URL = {}", clone);
            return ResponseEntity.badRequest().body("That repository cannot be visualised");
        } catch (IllegalBranchException e) {
            log.error("Repository does not include the specified branch = {}", branch);
            return ResponseEntity.badRequest().body("That branch does not exist on that repository");
        }

        return ResponseEntity.ok(commits);
    }

    @GetMapping("/previs")
    public ResponseEntity<?> prepareVisualisation(@RequestParam(name = "clone") String clone, @RequestParam(name = "branch") String branch, @RequestParam(name = "settings", required = false) String settingsURL) {
        log.info("Received request for API: /previs/{} with branch {} and settings {}", clone, branch, settingsURL);

        Git git;
        try {
            git = gitCloneService.getUpToDateRepositoryOrClone(clone);

        } catch (IllegalCloneException e) {
            log.error("Unable to prepare repository, may be malformed or not exist. URL = '{}'", clone);
            return ResponseEntity.badRequest().body("Invalid repository clone URL");
        }

        Settings settings = null;

        if (settingsURL != null) {
            try {
                settings = settingsService.manageSettings(settingsURL);
            } catch (IllegalURLException e) {
                log.error("Unable to get settings data. URL = '{}'", settingsURL);
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Invalid settings URL");
            }
        }

        RepositoryMetadata metadata = null;
        try {
            metadata = gitService.getRepositoryMetadata(clone, branch, git, settings);
        } catch (RepositoryTraverseException e) {
            log.error("Unable to traverse repository with clone URL = {}", clone);
            return ResponseEntity.badRequest().body("That repository cannot be visualised");
        } catch (IllegalBranchException e) {
            log.error("Repository does not include the specified branch = {}", branch);
            return ResponseEntity.badRequest().body("That branch does not exist on that repository");
        }
        return ResponseEntity.ok(metadata);
    }

}
