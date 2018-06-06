package com.iconpln.liquiditas.fcm.common.util;

import java.util.Optional;

/**
 * @author Langkuy <contact@ardikars.com>
 */
public class Validate {

    public static <T> T notNull(T reference, T defaultValue) {
        if (reference == null) {
            return defaultValue;
        }
        return reference;
    }

    public static <T> Optional<T> notNull(T reference) {
        if (reference == null) {
            return Optional.empty();
        }
        return Optional.of(reference);
    }

    public static <T> T notNull(T reference, NullPointerException exception) {
        if (reference == null) {
            if (exception == null) {
                throw new NullPointerException("Object reference should be not null.");
            }
            throw exception;
        }
        return reference;
    }

    public static <T> T notEmpty(Optional<T> reference, T defaultValue) {
        if (!reference.isPresent()) {
            return defaultValue;
        }
        return reference.get();
    }

}
