package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Structure {

    @JsonProperty
    public String label;

    @JsonProperty
    public String folder;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public String startCommitHash;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public String endCommitHash;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public boolean collapse;

}
