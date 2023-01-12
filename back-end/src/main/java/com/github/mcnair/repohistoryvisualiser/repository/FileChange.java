package com.github.mcnair.repohistoryvisualiser.repository;

import lombok.Data;

@Data
public class FileChange {

	public enum FileChangeType {
		A, M, D;
	}
	
	public final FileChangeType t;
	public final String f;
	
}
