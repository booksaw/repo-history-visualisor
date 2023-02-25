package com.github.mcnair.repohistoryvisualiser.repository;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Settings {

    @JsonProperty()
    public List<Milestone> milestones;

}
