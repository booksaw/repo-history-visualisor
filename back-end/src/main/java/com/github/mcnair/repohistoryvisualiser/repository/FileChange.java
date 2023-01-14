package com.github.mcnair.repohistoryvisualiser.repository;

import lombok.Data;

@Data
public class FileChange {

	public enum FileChangeType {
		A, M, D;
	}
	
	private final FileChangeType t;
	private final String f;
	
}
