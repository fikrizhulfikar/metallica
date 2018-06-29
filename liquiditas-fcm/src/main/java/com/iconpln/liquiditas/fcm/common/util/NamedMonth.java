package com.iconpln.liquiditas.fcm.common.util;

import com.ardikars.common.util.NamedNumber;
import java.util.HashMap;
import java.util.Map;

public class NamedMonth extends NamedNumber<Integer, NamedMonth> {

    private static final NamedMonth UNKNOWN
            = new NamedMonth(-1, "Unknown Month");

    private static final NamedMonth JANUARI
            = new NamedMonth(1, "Januari");

    private static final NamedMonth FEBRUARY
            = new NamedMonth(2, "Februari");

    private static final NamedMonth MARET
            = new NamedMonth(3, "Maret");

    private static final NamedMonth APRIL
            = new NamedMonth(4, "April");

    private static final NamedMonth MEI
            = new NamedMonth(5, "Mei");

    private static final NamedMonth JUNI
            = new NamedMonth(6, "Juni");

    private static final NamedMonth JULI
            = new NamedMonth(7, "Juli");

    private static final NamedMonth AGUSTUS
            = new NamedMonth(8, "Agustus");

    private static final NamedMonth SEPTEMBER
            = new NamedMonth(9, "September");

    private static final NamedMonth OKTOBER
            = new NamedMonth(10, "Oktober");

    private static final NamedMonth NOVEMBER
            = new NamedMonth(11, "November");

    private static final NamedMonth DESEMBER
            = new NamedMonth(12, "Desember");

    private static final Map<Integer, NamedMonth> registry
            = new HashMap<>();

    protected NamedMonth(Integer value, String name) {
        super(value, name);
    }

    public static NamedMonth getNamedMonth(int month) {
        return registry.getOrDefault(month, UNKNOWN);
    }

    static {
        registry.put(JANUARI.getValue(), JANUARI);
        registry.put(FEBRUARY.getValue(), FEBRUARY);
        registry.put(MARET.getValue(), MARET);
        registry.put(APRIL.getValue(), APRIL);
        registry.put(MEI.getValue(), MEI);
        registry.put(JUNI.getValue(), JUNI);
        registry.put(JULI.getValue(), JULI);
        registry.put(AGUSTUS.getValue(), AGUSTUS);
        registry.put(SEPTEMBER.getValue(), SEPTEMBER);
        registry.put(OKTOBER.getValue(), OKTOBER);
        registry.put(NOVEMBER.getValue(), NOVEMBER);
        registry.put(DESEMBER.getValue(), DESEMBER);
    }

}
