package com.github.mcnair.repohistoryvisualiser.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

@Service
public class YAMLService {

    /**
     * Used to stream YAML data from a web-page into an object
     * @param url The url to stream data from
     * @param classType The class type
     * @param <T> The type of the returned object
     * @return The object the data has been streamed into
     * @throws IOException Thrown if errors occur while reading the YAML data
     */
    public <T> T readYaml(URL url, Class<T> classType) throws IOException {

        var mapper = new ObjectMapper(new YAMLFactory());
        return mapper.readValue(url, classType);

    }

}
