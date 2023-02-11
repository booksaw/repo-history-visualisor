package com.github.mcnair.repohistoryvisualiser.exception;

import java.text.MessageFormat;

/**
 * Thrown when an invalid clone link is provided as the clone cannot be
 * performed
 * 
 * @author James McNair
 *
 */
public class IllegalBranchException extends Exception {

	private static final long serialVersionUID = 3909822247858757031L;

	/**
	 * the invalid branch
	 */
	private final String branch;

	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 */
	public IllegalBranchException(String branch) {
		super(MessageFormat.format("Invalid branch: {0}", branch));
		this.branch = branch;
	}

	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 * @param t        The throwable that caused the IllegalCloneException
	 */
	public IllegalBranchException(String branch, Throwable t) {
		super(MessageFormat.format("Invalid branch: {0}", branch), t);
		this.branch = branch;
	}

	public String getCloneURL() {
		return branch;
	}

}