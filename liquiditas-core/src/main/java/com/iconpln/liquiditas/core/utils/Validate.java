package com.iconpln.liquiditas.core.utils;

public class Validate {

    public static <T extends Object> T notNull(T reference, T defaultValue) {
        if (reference == null) {
            return defaultValue;
        }
        return reference;
    }

}
