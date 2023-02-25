package com.github.mcnair.repohistoryvisualiser.api;

import com.github.mcnair.repohistoryvisualiser.exception.*;
import com.github.mcnair.repohistoryvisualiser.repository.Repository;
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
    public ResponseEntity<?> showTestOutput(@RequestParam(name = "clone") String clone, @RequestParam(name = "branch") String branch) {
        log.info("Received request for API: /clone/{} with branch {}", clone, branch);

        // cloning the git repository locally
        Git git;
        try {
            git = gitCloneService.getExistingRepositoryOrNull(clone);
        } catch (IllegalURLException e) {
            log.error("Unable to clone repository, clone may be malformed or not exist. URL = '{}'", clone);
            return ResponseEntity.badRequest().body("Invalid repository clone URL");
        }

        // processing the git repository to get the data required
        Repository repo;
        try {
            repo = gitService.loadDataIntoRepository(clone, git, branch);
        } catch (RepositoryTraverseException e) {
            log.error("Unable to traverse repository with clone URL = {}", clone);
            return ResponseEntity.badRequest().body("That repository cannot be visualised");
        } catch (IllegalBranchException e) {
            log.error("Repository does not include the specified branch = {}", branch);
            return ResponseEntity.badRequest().body("That branch does not exist on that repository");
        }

        return ResponseEntity.ok(repo);
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
