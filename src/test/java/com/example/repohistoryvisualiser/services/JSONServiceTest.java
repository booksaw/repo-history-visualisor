package com.example.repohistoryvisualiser.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.services.JSONService;
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

import java.io.File;
import java.io.IOException;
import java.net.URL;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class JSONServiceTest {

    @Autowired
    @Spy
    private JSONService jsonService;

    @Mock
    private ObjectMapper mapper;

    @Test
    public void testReadingJSON() throws IOException {
        @Data
        class TypeClass {
            public final String name;
        }

        File file = new File("testfile");
        var typeClass = new TypeClass("test");

        Mockito.doReturn(typeClass).when(mapper).readValue((File) ArgumentMatchers.any(), (Class<Object>) ArgumentMatchers.any());
        Mockito.doReturn(mapper).when(jsonService).createMapper();

        TypeClass createdClass = jsonService.readJSON(file, TypeClass.class);

        Assertions.assertEquals(createdClass, typeClass);

        Mockito.reset(mapper);
        Mockito.reset(jsonService);
    }

    @Test
    public void testWritingJSON() throws IOException {
        @Data
        class TypeClass {
            public final String name;
        }

        File file = new File("testfile");

        Mockito.doReturn(mapper).when(jsonService).createMapper();

        jsonService.writeJSON(file, TypeClass.class);

        Assertions.assertNotNull(file);

        Mockito.reset(mapper);
        Mockito.reset(jsonService);
    }

    @Test
    public void testCreatingMapper() {

        var mapper = jsonService.createMapper();

        Assertions.assertNotNull(mapper);
    }

}
