package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Milestone {

    @JsonProperty
    public String commitHash;

    @JsonProperty
    public String milestone;

    public int commitID;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public Integer displayFor;

}
