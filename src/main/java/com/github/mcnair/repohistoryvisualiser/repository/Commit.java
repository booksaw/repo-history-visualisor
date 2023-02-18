package com.github.mcnair.repohistoryvisualiser.repository;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class Commit {

	private final int timestamp;

	private final List<FileChange> changes;
	
	private final String author;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private final String milestone;

}
