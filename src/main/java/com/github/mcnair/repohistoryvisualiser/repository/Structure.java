package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalStructureState;

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
    public Integer startCommitID;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public String endCommitHash;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public Integer endCommitID;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty
    public boolean collapse;

    /**
     * Function used to determine if a structure is active at a current commit
     * @param commitID the commit ID
     * @return If the structure is active
     */
    public boolean isActive(int commitID) {

        if((startCommitHash != null && startCommitID == null) || (endCommitHash != null && endCommitID == null) ) {
            throw new IllegalStructureState(this);
        }

        boolean hasStarted = (startCommitID == null) || (startCommitID <= commitID);
        boolean hasEnded = (endCommitID != null) && (endCommitID <= commitID + 1);

        return hasStarted && !hasEnded;
    }


}
