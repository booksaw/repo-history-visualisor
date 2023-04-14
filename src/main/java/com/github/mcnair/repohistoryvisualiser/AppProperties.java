package com.github.mcnair.repohistoryvisualiser;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:repoHistoryVisualiser.properties")
public class AppProperties {
	
	@Value("${application.cloneFolder}")
	private String cloneFolder;

	public String getCloneFolder() {
		return cloneFolder;
	}

	public void setCloneFolder(String cloneFolder) {
		this.cloneFolder = cloneFolder;
	}

	
}
