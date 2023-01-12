package com.github.mcnair.repohistoryvisualiser.services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffEntry.ChangeType;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.diff.RawTextComparator;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.util.io.DisabledOutputStream;
import org.springframework.stereotype.Service;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalBranchException;
import com.github.mcnair.repohistoryvisualiser.exception.RepositoryTraverseException;
import com.github.mcnair.repohistoryvisualiser.repository.Commit;
import com.github.mcnair.repohistoryvisualiser.repository.FileChange;
import com.github.mcnair.repohistoryvisualiser.repository.FileChange.FileChangeType;
import com.github.mcnair.repohistoryvisualiser.repository.Repository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GitService {

	public static FileChangeType getFileChangeType(ChangeType change) {
		switch (change) {
		case ADD:
			return FileChangeType.A;
		case MODIFY:
			return FileChangeType.M;
		case DELETE:
			return FileChangeType.D;
		default:
			return FileChangeType.A;
		}
	}

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

	public Repository loadDataIntoRepository(String cloneURL, Git git, String branch)
			throws RepositoryTraverseException, IllegalBranchException {
		var repo = new Repository(cloneURL);

		// adding commits
		try {
			var branchVar = git.getRepository().resolve(branch);
			
			if(branchVar == null) {
				throw new IllegalBranchException(branch);
			}
			
			for (RevCommit commit : git.log().add(branchVar).call()) {
				repo.addCommit(createCommit(git.getRepository(), commit));
			}

		} catch (GitAPIException | IOException e) {
			throw new RepositoryTraverseException(e);
		}

		return repo;
	}

	private Commit createCommit(org.eclipse.jgit.lib.Repository repo, RevCommit revCommit)
			throws RepositoryTraverseException {

		List<FileChange> changes;
		if (revCommit.getParentCount() == 0) {
			changes = getChangesFromRoot(repo, revCommit);
		} else {
			changes = getChangesFromParent(repo, revCommit);
		}

		return new Commit(revCommit.getCommitTime(), changes);

	}

	private List<FileChange> getChangesFromParent(org.eclipse.jgit.lib.Repository repo, RevCommit commit)
			throws RepositoryTraverseException {
		RevCommit parent = commit.getParent(0);

		List<FileChange> changes = new ArrayList<>();
		List<DiffEntry> diffs;

		try (DiffFormatter df = new DiffFormatter(DisabledOutputStream.INSTANCE)) {
			df.setRepository(repo);
			df.setDiffComparator(RawTextComparator.DEFAULT);
			diffs = df.scan(parent.getTree(), commit.getTree());
		} catch (IOException e) {
			throw new RepositoryTraverseException(e);
		}

		for (DiffEntry diff : diffs) {
			changes.add(new FileChange(getFileChangeType(diff.getChangeType()), diff.getNewPath()));
		}

		return changes;
	}

	private List<FileChange> getChangesFromRoot(org.eclipse.jgit.lib.Repository repo, RevCommit commit)
			throws RepositoryTraverseException {
		List<FileChange> changes = new ArrayList<>();
		try (var tw = new TreeWalk(repo)) {
			tw.addTree(commit.getTree());
			tw.setRecursive(true);
			
			while (tw.next()) {
				changes.add(new FileChange(FileChangeType.A, tw.getPathString()));
			}

		} catch (IOException e) {
			throw new RepositoryTraverseException(e);
		}

		return changes;
	}
}
