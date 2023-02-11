package com.github.mcnair.repohistoryvisualiser.services;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalCloneException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class URLService {

	
	public String decodeCloneURL(String url) throws IllegalCloneException {
		try {
			String decoded = URLDecoder.decode(url, StandardCharsets.UTF_8.name());
			decoded = URLDecoder.decode(decoded, StandardCharsets.UTF_8.name());
			return decoded;
		} catch (UnsupportedEncodingException e) {
			log.warn("Invalid URL provided as clone: {}", url);
			e.printStackTrace();
		}
		
		throw new IllegalCloneException(url);
		
	}
	
}
