package com.example.repohistoryvisualiser.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.services.YAMLService;
import lombok.Data;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;
import java.net.URL;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class YAMLServiceTests {

    @Autowired
    @Spy
    private YAMLService yamlService;

    @Mock
    private ObjectMapper mapper;

    @Test
    public void testCreatingYAMLService() {
        assertThat(yamlService).isNotNull();
    }

    @Test
    public void testReadingYAML() throws IOException {

        @Data
        class TypeClass {
            public final String name;
        }

        URL url = new URL("https://github.com");
        var typeClass = new TypeClass("test");

        Mockito.doReturn(typeClass).when(mapper).readValue((URL) ArgumentMatchers.any(), (Class<Object>) ArgumentMatchers.any());
        Mockito.doReturn(mapper).when(yamlService).createMapper();

        TypeClass createdClass = yamlService.readYaml(url, TypeClass.class);

        Assertions.assertEquals(createdClass, typeClass);

        Mockito.reset(mapper);
        Mockito.reset(yamlService);
    }

    @Test
    public void testCreatingMapper() {

        var mapper = yamlService.createMapper();

        Assertions.assertNotNull(mapper);
    }


}
