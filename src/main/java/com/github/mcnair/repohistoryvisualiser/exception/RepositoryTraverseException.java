package com.github.mcnair.repohistoryvisualiser.exception;

/**
 * Thrown when an error occurs during repository traversal performed
 * 
 * @author James McNair
 *
 */
public class RepositoryTraverseException extends Exception {

	private static final long serialVersionUID = 3909822247858757031L;


	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 */
	public RepositoryTraverseException() {
		super("an error occurred when traversing repository");
	}

	/**
	 * Used to create a new IllegalCloneException
	 * 
	 * @param cloneURL the URL that was attempted to be cloned
	 * @param t        The throwable that caused the IllegalCloneException
	 */
	public RepositoryTraverseException(Throwable t) {
		super("an error occurred when traversing repository", t);
	}



}