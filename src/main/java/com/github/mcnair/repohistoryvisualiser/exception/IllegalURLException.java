package com.github.mcnair.repohistoryvisualiser.exception;

import java.text.MessageFormat;

public class IllegalURLException extends Exception {
    /**
     * the URL that was attempted to be cloned
     */
    private final String URL;

    /**
     * Used to create a new IllegalURLException
     *
     * @param cloneURL the URL
     */
    public IllegalURLException(String cloneURL) {
        super(MessageFormat.format("Invalid URL: {0}", cloneURL));
        this.URL = cloneURL;
    }

    /**
     * Used to create a new IllegalURLException
     *
     * @param cloneURL the URL
     * @param t        The throwable that caused the IllegalCloneException
     */
    public IllegalURLException(String cloneURL, Throwable t) {
        super(MessageFormat.format("Invalid URL: {0}", cloneURL), t);
        this.URL = cloneURL;
    }

    public String getCloneURL() {
        return URL;
    }

}
