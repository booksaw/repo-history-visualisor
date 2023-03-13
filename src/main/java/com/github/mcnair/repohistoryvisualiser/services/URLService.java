package com.github.mcnair.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class URLService {


    public String decodeURL(String url) throws IllegalURLException {
        try {
            String decoded = URLDecoder.decode(url, StandardCharsets.UTF_8.name());
            decoded = URLDecoder.decode(decoded, StandardCharsets.UTF_8.name());
            return decoded;
        } catch (UnsupportedEncodingException e) {
            // this cannot be thrown unless executed in a non UTF-8 environment,
            // but error must be handeled
            throw new AssertionError("UTF-8 not supported");
        }
    }

    public List<String> performURLGet(String urlStr) throws IllegalURLException {
        URL url = null;
        HttpURLConnection con;
        try {
            url = new URL(urlStr);
            con = getConnection(url);
            con.setRequestMethod("GET");
        } catch (IOException e) {
            throw new IllegalURLException(urlStr, e);
        }

		if(con == null) {
			throw new IllegalURLException(urlStr);
		}

		List<String> result = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(con.getInputStream()))) {
            for (String line; (line = reader.readLine()) != null; ) {
                result.add(line);
            }
        } catch(IOException e) {
            throw new IllegalURLException(urlStr, e);
		}

		return result;
    }

    public HttpURLConnection getConnection(URL url) throws IOException {
        return (HttpURLConnection) url.openConnection();
    }

}
