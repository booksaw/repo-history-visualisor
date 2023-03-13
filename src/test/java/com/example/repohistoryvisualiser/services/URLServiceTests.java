package com.example.repohistoryvisualiser.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.github.mcnair.repohistoryvisualiser.RepoHistoryVisualisorApplication;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.services.URLService;
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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@ContextConfiguration(classes = RepoHistoryVisualisorApplication.class)
@ExtendWith(MockitoExtension.class)
public class URLServiceTests {

    @Autowired
    @Spy
    private URLService urlService;

    @Mock
    HttpURLConnection connection;

    @Test
    public void testCreatingURLService() {
        assertThat(urlService).isNotNull();
    }

    @Test
    public void testDecodingURL() throws IllegalURLException {

        String decoded = urlService.decodeURL("https%3A%2F%2F");

        assertThat(decoded).isEqualTo("https://");
    }

    @Test
    public void testHTTPGet() throws IllegalURLException, IOException {
        var inputResponse = new ByteArrayInputStream("response string".getBytes());

        Mockito.doReturn(connection).when(urlService).getConnection(ArgumentMatchers.any());
        Mockito.doReturn(inputResponse).when(connection).getInputStream();

        List<String> response = urlService.performURLGet("https://github.com/booksaw");

        Assertions.assertEquals(response.get(0), "response string");
        Assertions.assertEquals(response.size(), 1);

        Mockito.reset(urlService);
        Mockito.reset(connection);
    }

    @Test
    public void testHTTPGetMalformedURL() throws IOException {
        var inputResponse = new ByteArrayInputStream("response string".getBytes());

        Mockito.doReturn(connection).when(urlService).getConnection(ArgumentMatchers.any());
        Mockito.doReturn(inputResponse).when(connection).getInputStream();

        Assertions.assertThrows(IllegalURLException.class, () -> {
            urlService.performURLGet("");
        });

        Mockito.reset(urlService);
        Mockito.reset(connection);
    }

    @Test
    public void testHTTPGetNoConnection() throws IOException {
        var inputResponse = new ByteArrayInputStream("response string".getBytes());

        Mockito.doReturn(null).when(urlService).getConnection(ArgumentMatchers.any());

        Assertions.assertThrows(IllegalURLException.class, () -> {
            urlService.performURLGet("");
        });

        Mockito.reset(urlService);
    }

}
