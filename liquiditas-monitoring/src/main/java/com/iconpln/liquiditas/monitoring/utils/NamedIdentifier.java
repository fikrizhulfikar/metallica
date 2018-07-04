package com.iconpln.liquiditas.monitoring.utils;

import com.ardikars.common.util.NamedNumber;
import java.util.HashMap;
import java.util.Map;

public class NamedIdentifier extends NamedNumber<Integer, NamedIdentifier> {

    public static final NamedIdentifier REKAP_PEMBAYARAN
            = new NamedIdentifier(1, "Rekap Pembayaran");

    public static final NamedIdentifier TRIPARTITE
            = new NamedIdentifier(2, "Tripartite");

    public static final NamedIdentifier UNKNOWN
            = new NamedIdentifier(-1, "UNKNOWN");

    private static final Map<Integer, NamedIdentifier> registry = new HashMap<>();

    public NamedIdentifier(Integer value, String name) {
        super(value, name);
    }

    public static NamedIdentifier getNamedIdentifier(int value)  {
        return registry.getOrDefault(value, UNKNOWN);
    }

    public static NamedIdentifier register(NamedIdentifier namedIdentifier) {
        registry.put(namedIdentifier.getValue(), namedIdentifier);
        return namedIdentifier;
    }

    static {
        registry.put(REKAP_PEMBAYARAN.getValue(), REKAP_PEMBAYARAN);
        registry.put(TRIPARTITE.getValue(), TRIPARTITE);
    }

}
