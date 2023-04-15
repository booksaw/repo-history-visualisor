package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class FileChange {

	public FileChange(FileChangeType type, String file) {
		this.type = type;
		this.file = file;
	}

	public enum FileChangeType {
		A, M, D, EXPANDED;
	}
	
	private FileChangeType type;
	private String file;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Boolean collapsed;
	
}
