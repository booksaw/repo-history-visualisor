package com.github.mcnair.repohistoryvisualiser.api;

import com.github.mcnair.repohistoryvisualiser.exception.*;
import com.github.mcnair.repohistoryvisualiser.repository.Milestones;
import com.github.mcnair.repohistoryvisualiser.repository.Repository;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import com.github.mcnair.repohistoryvisualiser.services.MilestoneService;
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
    private MilestoneService milestoneService;

    /**
     * Used to clone a repository locally
     *
     * @param clone The repository to clone
     * @return The response to the request
     */
    @GetMapping("/clone/")
    public ResponseEntity<?> showTestOutput(@RequestParam(name = "clone") String clone, @RequestParam(name = "branch") String branch, @RequestParam(name = "milestones", required = false) String milestoneURL) {
        log.info("Received request for API: /clone/{} with branch {} and milestones {} ", clone, branch, milestoneURL);

        Milestones milestones = new Milestones();
        if (milestoneURL != null && !milestoneURL.isEmpty()) {
            log.info("entering milestones");
            try {
                milestones = milestoneService.manageMilestones(milestoneURL);
            } catch (IllegalMilestonesException e) {
                log.error("Unable to fetch milestones, milestones URL may be malformed or not exist. URL = '{}'", milestoneURL);
                return ResponseEntity.badRequest().body("Invalid milestones URL");
            }
        }

        // cloning the git repository locally
        String decodedUrl;
        Git git;
        try {
            decodedUrl = urlService.decodeURL(clone);
            git = gitCloneService.getRepositoryOrClone(decodedUrl);
        } catch (IllegalCloneException | IllegalURLException e) {
            log.error("Unable to clone repository, clone may be malformed or not exist. URL = '{}'", clone);
            return ResponseEntity.badRequest().body("Invalid repository clone URL");
        }

        // processing the git repository to get the data required
        Repository repo;
        try {
            repo = gitService.loadDataIntoRepository(decodedUrl, git, branch, milestones);
        } catch (RepositoryTraverseException e) {
            log.error("Unable to traverse repository with clone URL = {}", clone);
            e.printStackTrace();
            return ResponseEntity.badRequest().body("That repository cannot be visualised");
        } catch (IllegalBranchException e) {
            log.error("Repository does not include the specified branch = {}", branch);
            return ResponseEntity.badRequest().body("That branch does not exist on that repository");
        }

        return ResponseEntity.ok(repo);
    }

}
