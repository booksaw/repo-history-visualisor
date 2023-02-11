package com.github.mcnair.repohistoryvisualiser.repository;

import java.util.List;

import lombok.Data;

@Data
public class Commit {

	private final int t;

	private final List<FileChange> c;
	
	private final String a;

}
