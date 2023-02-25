package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class RepositoryMetadata {

    public final String url;

    public final String branch;

    public final int totalCommits;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public final Settings settings;

}
