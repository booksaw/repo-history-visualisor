package com.github.mcnair.repohistoryvisualiser.repository;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class Repository {

	public final String u;
	
	public final List<Commit> commits = new ArrayList<>();
	
	public void addCommit(Commit commit) {
		commits.add(commit);
	}
	
	public void addCommits(List<Commit> commits) {
		this.commits.addAll(commits);
	}
	
}
