package com.github.mcnair.repohistoryvisualiser.exception;

import java.text.MessageFormat;

/**
 * Thrown when an invalid clone link is provided as the clone cannot be
 * performed
 * 
 * @author James McNair
 *
 */
public class IllegalCloneException extends Exception {

	private static final long serialVersionUID = 3909822247858757031L;

	/**
	 * the URL that was attempted to be cloned
	 */
	private final String cloneURL;

	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 */
	public IllegalCloneException(String cloneURL) {
		super(MessageFormat.format("Invalid URL for cloning: {0}", cloneURL));
		this.cloneURL = cloneURL;
	}

	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 * @param t        The throwable that caused the IllegalCloneException
	 */
	public IllegalCloneException(String cloneURL, Throwable t) {
		super(MessageFormat.format("Invalid URL for cloning: {0}", cloneURL), t);
		this.cloneURL = cloneURL;
	}

	public IllegalCloneException() {
		super("Invalid URL for cloning");
		cloneURL = null;
	}

	public String getCloneURL() {
		return cloneURL;
	}

}
