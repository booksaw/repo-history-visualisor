package com.github.mcnair.repohistoryvisualiser.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class JSONService {

    public <T> void writeJSON(File file, T object) throws IOException {
        ObjectMapper mapper = createMapper();
        mapper.writeValue(file, object);
    }

    public <T> T readJSON(File file, Class<T> classType) throws IOException {
        ObjectMapper mapper = createMapper();
        return mapper.readValue(file, classType);
    }

    public ObjectMapper createMapper() {
        return new ObjectMapper();
    }

}
