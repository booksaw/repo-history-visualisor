package com.github.mcnair.repohistoryvisualiser.repository;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class Commit {

	private final int t;

	private final List<FileChange> c;
	
	private final String b;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private final String m;

}
