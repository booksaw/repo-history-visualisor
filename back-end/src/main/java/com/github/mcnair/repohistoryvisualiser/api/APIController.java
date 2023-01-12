package com.github.mcnair.repohistoryvisualiser.api;

import org.eclipse.jgit.api.Git;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;
import com.github.mcnair.repohistoryvisualiser.exception.RepositoryTraverseException;
import com.github.mcnair.repohistoryvisualiser.repository.Repository;
import com.github.mcnair.repohistoryvisualiser.services.GitCloneService;
import com.github.mcnair.repohistoryvisualiser.services.GitService;
import com.github.mcnair.repohistoryvisualiser.services.URLService;

import lombok.extern.slf4j.Slf4j;

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

	/**
	 * Used to clone a repository locally
	 * 
	 * @param clone The repository to clone
	 * @return The response to the request
	 */
	@GetMapping("/clone/{clone}")
	public ResponseEntity<?> showTestOutput(@PathVariable String clone) {
		log.info("Recieved request for API: /clone/{} ", clone);

		String decodedUrl;
		Git git;
		try {
			decodedUrl = urlService.decodeCloneURL(clone);
			git = gitCloneService.getRepositoryOrClone(decodedUrl);
		} catch (IllegalCloneException e) {
			log.error("Unable to clone repository, clone may be malformed or not exist. URL = '{}'", clone);
			return ResponseEntity.badRequest().body("Invalid repository clone URL");
		}

		Repository repo;
		try {
			repo = gitService.loadDataIntoRepository(decodedUrl, git, "master");
		} catch (RepositoryTraverseException e) {
			log.error("Unable to traverse repository with clone URL = {}", clone);
			e.printStackTrace();
			return ResponseEntity.badRequest().body("That repository cannot be visualised");
		}

		return ResponseEntity.ok(repo);
	}

}
