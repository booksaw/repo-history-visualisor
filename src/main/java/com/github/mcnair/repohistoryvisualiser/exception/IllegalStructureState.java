package com.github.mcnair.repohistoryvisualiser.exception;

import com.github.mcnair.repohistoryvisualiser.repository.Structure;

public class IllegalStructureState extends IllegalArgumentException {

    private final Structure structure;

    public IllegalStructureState(Structure structure) {
        super("A structure has not been correctly configured. Structure Label = " + structure.label);
        this.structure = structure;
    }

    public Structure getStructure() {
        return structure;
    }

}
