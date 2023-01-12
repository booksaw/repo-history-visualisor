package com.github.mcnair.repohistoryvisualiser.repository;

import java.util.List;

import lombok.Data;

@Data
public class Commit {

	public final int t;

	public final List<FileChange> c;

}
