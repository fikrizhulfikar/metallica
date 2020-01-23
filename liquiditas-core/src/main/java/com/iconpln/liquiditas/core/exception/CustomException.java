package com.iconpln.liquiditas.core.exception;

/**
 * Created by israjhaliri on 8/28/17.
 */
public class CustomException extends RuntimeException {
    public CustomException() {
        super();
    }
    public CustomException(String s) {
        super(s);
    }
    public CustomException(String s, Throwable throwable) {
        super(s, throwable);
    }
    public CustomException(Throwable throwable) {
        super(throwable);
    }
}