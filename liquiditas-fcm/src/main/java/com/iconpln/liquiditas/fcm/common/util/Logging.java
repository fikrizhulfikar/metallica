package com.iconpln.liquiditas.fcm.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Logging {

    public static final Logging instance = new Logging();

    private Logging() { }

    public static Logging getInstance() {
        return instance;
    }

    public Logger getLogger(Object object) {
        return LoggerFactory.getLogger(object.getClass());
    }

}
