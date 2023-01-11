package com.github.mcnair.repohistoryvisualiser.services;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.MessageFormat;

import javax.validation.constraints.NotNull;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.mcnair.repohistoryvisualiser.AppProperties;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;

/**
 * File to manage the cloned repositories
 * 
 * @author James McNair
 *
 */
@Service
public class GitCloneService {

	@Autowired
	private GitService gitService;

	@Autowired
	private AppProperties properties;
	
	/**
	 * used to get a repository which has already been cloned
	 * 
	 * @param url The clone url
	 * @return The created repository
	 * @throws IllegalCloneException thrown if the clone url is invalid
	 */
	public Git getExistingRepositoryOrNull(String url) throws IllegalCloneException {
		var folder = getCloneFolder(url);

		try {
			return gitService.getLocalRepository(folder);
		} catch (IOException e) {
			return null;
		}
	}

	/**
	 * Used to get an existing cloned repository, or to clone it if it does not
	 * exist
	 * 
	 * @param url the clone URL
	 * @return The repository
	 * @throws IllegalCloneException if the repository cannot be cloned
	 */
	public Git getRepositoryOrClone(String url) throws IllegalCloneException {
		var git = getExistingRepositoryOrNull(url);

		if (git != null) {
			return git;
		}

		return cloneRepository(url);
	}

	/**
	 * Gets the folder that the repository will be cloned to in the local directory
	 * 
	 * @param cloneURL the clone URL
	 * @return The folder to clone to
	 * @throws IllegalCloneException thrown if the clone url is invalid
	 */
	public @NotNull File getCloneFolder(@NotNull String cloneURL) throws IllegalCloneException {

		String path;

		try {
			URL url = new URL(cloneURL);
			path = url.getHost() + url.getPath();
		} catch (MalformedURLException e) {
			throw new IllegalCloneException(cloneURL, e);
		}

		// as .git is not actually needed in the clone link, removing it from the path
		// name
		// to ensure there are no duplicate entries
		if (path.endsWith(".git")) {
			path = path.substring(0, path.length() - ".git".length());
		}

		File f = new File(MessageFormat.format("{0}{1}{2}", properties.getCloneFolder(), File.separator, path));
		f.mkdirs();

		return f;
	}

	/**
	 * Clone a repository to the file system
	 * 
	 * @param url The URL of the repository to clone
	 * @return The cloned repository
	 * @throws IllegalCloneException Thrown if the repository cannot be cloned
	 */
	private Git cloneRepository(String url) throws IllegalCloneException {
		var folder = getCloneFolder(url);
		try {
			return gitService.cloneRepositoryToDirectory(url, folder, true);
		} catch (GitAPIException e) {
			throw new IllegalCloneException(url, e);
		}

	}

}
