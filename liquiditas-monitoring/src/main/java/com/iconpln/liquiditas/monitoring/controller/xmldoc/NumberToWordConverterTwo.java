package com.iconpln.liquiditas.monitoring.controller.xmldoc;

public class NumberToWordConverterTwo {
    // Strings at index 0 is not used, it is to make array
// indexing simple
    static String one[] = {"", "SATU ", "DUA ", "TIGA ", "EMPAT ",
            "LIMA ", "ENAM ", "TUJUH ", "DELAPAN ",
            "SEMBILAN ", "SEPULUH ", "SEBELAS "
    };

    // Strings at index 0 and 1 are not used, they is to
// make array indexing simple
    static String ten[] = {"", "", "DUA PULUH ", "TIGA PULUH ", "EMPAT PULUH ",
            "LIMA PULUH ", "ENAM PULUH ", "TUJUH PULUH ", "DELAPAN PULUH ",
            "SEMBILAN PULUH "};

    // n is 1- or 2-digit number
    static String numToWords(int n, String s) { // n = 0
        String str = "";
        // if n is more than 19, divide it
        if (n > 19) {
            str += ten[n / 10] + one[n % 10];
        } else {
            str += one[n];
        }

        // if n is non-zero
        if (n != 0) {
            str += s;
        }

        return str;
    }

    // Function to print a given number in words
    static String convertToWords(long n) {
        // stores word representation of given number n
        String out = "";
//        out += numToWords((int) ((n / 1000000000)), "MILIAR ");
        // handles digits at ten millions and hundred
        // millions places (if any)
        out += numToWords((int) ((n / 1000000) % 100), "JUTA ");

        // handles digits at thousands and tens thousands
        // places (if any)
        out += numToWords((int) ((n / 1000) % 100), "RIBU ");

        // handles digit at hundreds places (if any)
        out += numToWords((int) ((n / 100) % 10), "RATUS ");
//
//        if (n > 100 && n % 100 > 0) {
//            out += "and ";
//        }

        // handles digits at ones and tens places (if any)
        out += numToWords((int) (n % 100), "");

        return out;
    }

    // Driver code
    public static void main(String[] args) {
        // long handles upto 9 digit no
        // change to unsigned long long int to
        // handle more digit number
        long n = 12;

        // convert given number in words
        System.out.printf(convertToWords(n));

    }
}
