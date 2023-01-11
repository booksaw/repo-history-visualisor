package com.github.mcnair.repohistoryvisualiser.services;

import java.io.File;
import java.io.IOException;

import javax.validation.constraints.NotNull;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GitService {

	/**
	 * Used to clone a repository from its url into the specified folder
	 * 
	 * @param url        The clone URL of the repository
	 * @param directory  The directory to clone the repository to
	 * @param noCheckout if the no checkout flag should be applied
	 * @return The repository
	 * @throws GitAPIException Thrown if an error occurs during cloning
	 */
	public @NotNull Git cloneRepositoryToDirectory(@NotNull String url, @NotNull File directory,
			@NotNull boolean noCheckout) throws GitAPIException {
		log.info("Cloning {} to {}", url, directory.getAbsolutePath());
		return Git.cloneRepository().setURI(url).setNoCheckout(noCheckout).setDirectory(directory).call();
	}

	public Git getLocalRepository(File directory) throws IOException {
		return Git.open(directory);
	}

}
