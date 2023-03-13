package com.github.mcnair.repohistoryvisualiser.exception;

import java.text.MessageFormat;

public class IllegalURLException extends Exception {

    private static final long serialVersionUID = 3909822247858757039L;


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
     * @param URL the URL
     * @param t        The throwable that caused the IllegalCloneException
     */
    public IllegalURLException(String URL, Throwable t) {
        super(MessageFormat.format("Invalid URL: {0}", URL), t);
        this.URL = URL;
    }

    public String getCloneURL() {
        return URL;
    }

}
