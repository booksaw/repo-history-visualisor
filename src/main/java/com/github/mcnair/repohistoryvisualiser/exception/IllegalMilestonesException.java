package com.github.mcnair.repohistoryvisualiser.exception;

import java.text.MessageFormat;

public class IllegalMilestonesException extends Exception {

    /**
     * the URL that was provided for milestones
     */
    private final String milestonesURL;

    public IllegalMilestonesException() {
        super();
        milestonesURL = null;
    }

    /**
     * Used to create a new IllegalCloneException
     *
     * @param milestonesURL the URL that was provided for milestones
     */
    public IllegalMilestonesException(String milestonesURL) {
        super(MessageFormat.format("Invalid URL for milestones: {0}", milestonesURL));
        this.milestonesURL = milestonesURL;
    }

    /**
     * Used to create a new IllegalCloneException
     *
     * @param milestonesURL the URL that was provided for milestones
     * @param t        The throwable that caused the IllegalCloneException
     */
    public IllegalMilestonesException(String milestonesURL, Throwable t) {
        super(MessageFormat.format("Invalid URL for milestones: {0}", milestonesURL), t);
        this.milestonesURL = milestonesURL;
    }

    public String getMilestonesURL() {
        return milestonesURL;
    }


}
