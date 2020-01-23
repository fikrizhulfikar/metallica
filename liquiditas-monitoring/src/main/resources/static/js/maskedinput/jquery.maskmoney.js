(function ($) {
    "use strict";
    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }

    var methods = {
        destroy: function () {
            $(this).unbind(".maskMoney");

            if ($.browser.msie) {
                this.onpaste = null;
            }
            return this;
        },

        mask: function (value) {
            return this.each(function () {
                var $this = $(this);
                if (typeof value === "number") {
                    $this.val(value);
                }
                return $this.trigger("mask");
            });
        },

        unmasked: function () {
            return this.map(function () {
                var value = ($(this).val() || "0"),
                    isNegative = value.indexOf("-") !== -1,
                    decimalPart;
                // get the last position of the array that is a number(coercion makes "" to be evaluated as false)
                $(value.split(/\D/).reverse()).each(function (index, element) {
                    if (element) {
                        decimalPart = element;
                        return false;
                    }
                });
                value = value.replace(/\D/g, "");
                value = value.replace(new RegExp(decimalPart + "$"), "." + decimalPart);
                if (isNegative) {
                    value = "-" + value;
                }
                return parseFloat(value);
            });
        },

        init: function (parameters) {
            parameters = $.extend({
                prefix: "",
                suffix: "",
                affixesStay: true,
                thousands: ",",
                decimal: ".",
                precision: 2,
                allowZero: false,
                allowNegative: false
            }, parameters);

            return this.each(function () {
                var $input = $(this), settings,
                    onFocusValue;

                // data-* api
                settings = $.extend({}, parameters);
                settings = $.extend(settings, $input.data());

                function getInputSelection() {
                    var el = $input.get(0),
                        start = 0,
                        end = 0,
                        normalizedValue,
                        range,
                        textInputRange,
                        len,
                        endRange;

                    if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
                        start = el.selectionStart;
                        end = el.selectionEnd;
                    } else {
                        range = document.selection.createRange();

                        if (range && range.parentElement() === el) {
                            len = el.value.length;
                            normalizedValue = el.value.replace(/\r\n/g, "\n");

                            // Create a working TextRange that lives only in the input
                            textInputRange = el.createTextRange();
                            textInputRange.moveToBookmark(range.getBookmark());

                            // Check if the start and end of the selection are at the very end
                            // of the input, since moveStart/moveEnd doesn't return what we want
                            // in those cases
                            endRange = el.createTextRange();
                            endRange.collapse(false);

                            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                                start = end = len;
                            } else {
                                start = -textInputRange.moveStart("character", -len);
                                start += normalizedValue.slice(0, start).split("\n").length - 1;

                                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                    end = len;
                                } else {
                                    end = -textInputRange.moveEnd("character", -len);
                                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                                }
                            }
                        }
                    }

                    return {
                        start: start,
                        end: end
                    };
                } // getInputSelection

                function canInputMoreNumbers() {
                    var haventReachedMaxLength = !($input.val().length >= $input.attr("maxlength") && $input.attr("maxlength") >= 0),
                        selection = getInputSelection(),
                        start = selection.start,
                        end = selection.end,
                        haveNumberSelected = (selection.start !== selection.end && $input.val().substring(start, end).match(/\d/)) ? true : false,
                        startWithZero = ($input.val().substring(0, 1) === "0");
                    return haventReachedMaxLength || haveNumberSelected || startWithZero;
                }

                function setCursorPosition(pos) {
                    $input.each(function (index, elem) {
                        if (elem.setSelectionRange) {
                            elem.focus();
                            elem.setSelectionRange(pos, pos);
                        } else if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.collapse(true);
                            range.moveEnd("character", pos);
                            range.moveStart("character", pos);
                            range.select();
                        }
                    });
                }

                function setSymbol(value) {
                    var operator = "";
                    if (value.indexOf("-") > -1) {
                        value = value.replace("-", "");
                        operator = "-";
                    }
                    return operator + settings.prefix + value + settings.suffix;
                }

                function maskValue(value) {
                    var negative = (value.indexOf("-") > -1 && settings.allowNegative) ? "-" : "",
                        onlyNumbers = value.replace(/[^0-9]/g, ""),
                        integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision),
                        newValue,
                        decimalPart,
                        leadingZeros;

                    // remove initial zeros
                    integerPart = integerPart.replace(/^0*/g, "");
                    // put settings.thousands every 3 chars
                    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
                    if (integerPart === "") {
                        integerPart = "0";
                    }
                    newValue = negative + integerPart;

                    if (settings.precision > 0) {
                        decimalPart = onlyNumbers.slice(onlyNumbers.length - settings.precision);
                        leadingZeros = new Array((settings.precision + 1) - decimalPart.length).join(0);
                        newValue += settings.decimal + leadingZeros + decimalPart;
                    }
                    return setSymbol(newValue);
                }


                function maskAndPosition(startPos) {
                    var originalLen = $input.val().length,
                        newLen;
                    $input.val(maskValue($input.val()));
                    newLen = $input.val().length;
                    startPos = startPos - (originalLen - newLen);
                    setCursorPosition(startPos);
                }

                function mask() {
                    var value = $input.val();
                    if (settings.precision > 0 && value.indexOf(settings.decimal) < 0) {
                        value += settings.decimal + new Array(settings.precision + 1).join(0);
                    }
                    $input.val(maskValue(value));
                }

                function changeSign() {
                    var inputValue = $input.val();
                    if (settings.allowNegative) {
                        if (inputValue !== "" && inputValue.charAt(0) === "-") {
                            return inputValue.replace("-", "");
                        } else {
                            return "-" + inputValue;
                        }
                    } else {
                        return inputValue;
                    }
                }

                function preventDefault(e) {
                    if (e.preventDefault) { //standard browsers
                        e.preventDefault();
                    } else { // old internet explorer
                        e.returnValue = false;
                    }
                }

                function keypressEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode,
                        keyPressedChar,
                        selection,
                        startPos,
                        endPos,
                        value;
                    //added to handle an IE "special" event
                    if (key === undefined) {
                        return false;
                    }

                    // any key except the numbers 0-9
                    if (key < 48 || key > 57) {
                        // -(minus) key
                        if (key === 45) {
                            $input.val(changeSign());
                            return false;
                            // +(plus) key
                        }
                        else if (key === 43) {
                            $input.val($input.val().replace("-", ""));
                            return false;
                            // enter key or tab key
                        } else if (key === 13 || key === 9) {
                            return true;
                        } else if ($.browser.mozilla && (key === 37 || key === 39) && e.charCode === 0) {
                            // needed for left arrow key or right arrow key with firefox
                            // the charCode part is to avoid allowing "%"(e.charCode 0, e.keyCode 37)
                            return true;
                        } else { // any other key with keycode less than 48 and greater than 57
                            preventDefault(e);
                            return true;
                        }
                    } else if (!canInputMoreNumbers()) {
                        return false;
                    } else {
                        preventDefault(e);

                        keyPressedChar = String.fromCharCode(key);
                        selection = getInputSelection();
                        startPos = selection.start;
                        endPos = selection.end;
                        value = $input.val();
                        $input.val(value.substring(0, startPos) + keyPressedChar + value.substring(endPos, value.length));
                        maskAndPosition(startPos + 1);
                        return false;
                    }
                }

                function keydownEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode,
                        selection,
                        startPos,
                        endPos,
                        value,
                        lastNumber;
                    //needed to handle an IE "special" event
                    if (key === undefined) {
                        return false;
                    }

                    selection = getInputSelection();
                    startPos = selection.start;
                    endPos = selection.end;

                    if (key === 8 || key === 46 || key === 63272) { // backspace or delete key (with special case for safari)
                        preventDefault(e);

                        value = $input.val();
                        // not a selection
                        if (startPos === endPos) {
                            // backspace
                            if (key === 8) {
                                if (settings.suffix === "") {
                                    startPos -= 1;
                                } else {
                                    // needed to find the position of the last number to be erased
                                    lastNumber = value.split("").reverse().join("").search(/\d/);
                                    startPos = value.length - lastNumber - 1;
                                    endPos = startPos + 1;
                                }
                                //delete
                            } else {
                                endPos += 1;
                            }
                        }

                        $input.val(value.substring(0, startPos) + value.substring(endPos, value.length));

                        maskAndPosition(startPos);
                        return false;
                    } else if (key === 9) { // tab key
                        return true;
                    } else { // any other key
                        return true;
                    }
                }

                function focusEvent() {
                    onFocusValue = $input.val();
                    mask();
                    var input = $input.get(0),
                        textRange;
                    if (input.createTextRange) {
                        textRange = input.createTextRange();
                        textRange.collapse(false); // set the cursor at the end of the input
                        textRange.select();
                    }
                }

                function cutPasteEvent() {
                    setTimeout(function () {
                        mask();
                    }, 0);
                }

                function getDefaultMask() {
                    var n = parseFloat("0") / Math.pow(10, settings.precision);
                    return (n.toFixed(settings.precision)).replace(new RegExp("\\.", "g"), settings.decimal);
                }

                function blurEvent(e) {
                    if ($.browser.msie) {
                        keypressEvent(e);
                    }

                    if ($input.val() === "" || $input.val() === setSymbol(getDefaultMask())) {
                        if (!settings.allowZero) {
                            $input.val("");
                        } else if (!settings.affixesStay) {
                            $input.val(getDefaultMask());
                        } else {
                            $input.val(setSymbol(getDefaultMask()));
                        }
                    } else {
                        if (!settings.affixesStay) {
                            var newValue = $input.val().replace(settings.prefix, "").replace(settings.suffix, "");
                            $input.val(newValue);
                        }
                    }
                    if ($input.val() !== onFocusValue) {
                        $input.change();
                    }
                }

                function clickEvent() {
                    var input = $input.get(0),
                        length;
                    if (input.setSelectionRange) {
                        length = $input.val().length;
                        input.setSelectionRange(length, length);
                    } else {
                        $input.val($input.val());
                    }
                }

                $input.unbind(".maskMoney");
                $input.bind("keypress.maskMoney", keypressEvent);
                $input.bind("keydown.maskMoney", keydownEvent);
                $input.bind("blur.maskMoney", blurEvent);
                $input.bind("focus.maskMoney", focusEvent);
                $input.bind("click.maskMoney", clickEvent);
                $input.bind("cut.maskMoney", cutPasteEvent);
                $input.bind("paste.maskMoney", cutPasteEvent);
                $input.bind("mask.maskMoney", mask);
            });
        }
    };

    $.fn.maskMoney = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.maskMoney");
        }
    };
})(window.jQuery || window.Zepto);


var formatMoney = function (num) {
    if (num != null) {
        var str = num.toString().replace("Rp ", ""), parts = false, output = [], i = 1, formatted = null;
        if (str.indexOf(".") > 0) {
            parts = str.split(".");
            str = parts[0];
            //console.log("strparts", str);
        }
        str = str.split("").reverse();
        for (var j = 0, len = str.length; j < len; j++) {
            if (str[j] != ".") {
                output.push(str[j]);
                if (i % 3 == 0 && j < (len - 1)) {
                    output.push(".");
                }
                i++;
            }
        }

        formatted = output.reverse().join("");
        //return("Rp " + formatted + ((parts) ? "." + parts[1].substr(0, 3) : "") + ",00");
        return ("Rp " + formatted + ((parts[1]) ? "," + parts[1] : ",00"));
    }
};

var formatMoneyNoRP = function (num) {
    if (num != null) {
        var str = num.toString().replace("", ""), parts = false, output = [], i = 1, formatted = null;
        if (str.indexOf(".") > 0) {
            parts = str.split(".");
            str = parts[0];
            //console.log("strparts", str);
        }
        str = str.split("").reverse();
        for (var j = 0, len = str.length; j < len; j++) {
            if (str[j] != ".") {
                output.push(str[j]);
                if (i % 3 == 0 && j < (len - 1)) {
                    output.push(".");
                }
                i++;
            }
        }

        formatted = output.reverse().join("");
        //return("Rp " + formatted + ((parts) ? "." + parts[1].substr(0, 3) : "") + ",00");
        return ("Rp " + formatted + ((parts[1]) ? "," + parts[1] : ",00"));
    }
};

var formatMoneyUSD = function (num) {
    if (num != null) {
        var str = num.toString().replace("", ""), parts = false, output = [], i = 1, formatted = null;
        if (str.indexOf(",") > 0) {
            parts = str.split(",");
            str = parts[0];
            //console.log("strparts", str);
        }
        str = str.split("").reverse();
        for (var j = 0, len = str.length; j < len; j++) {
            if (str[j] != ",") {
                output.push(str[j]);
                if (i % 3 == 0 && j < (len - 1)) {
                    output.push(",");
                }
                i++;
            }
        }

        formatted = output.reverse().join("");
        //return("Rp " + formatted + ((parts) ? "." + parts[1].substr(0, 3) : "") + ",00");
        //    return ("Rp " + formatted + ((parts[1])? "." + parts[1] : ".00"));
        return ("" + formatted + ((parts[1]) ? "." + parts[1] : ""));
    }
};


var moneyToNumber = function (num) {
    if (num != null) {
        var csqft_price = num;
        csqft_price = csqft_price.replace(/\./gi, "").replace(/Rp/gi, "").replace(" ", "");
        csqft_price = csqft_price.split(",");
        return parseFloat(parseFloat(csqft_price[0] + "." + csqft_price[1]));
    }
};


function formatAngka(angka) {
    if (angka == null) {
        return 0
    } else {

        if (typeof(angka) != 'string') angka = angka.toString();
        var reg = new RegExp('([0-9]+)([0-9]{3})');
        while (reg.test(angka)) angka = angka.replace(reg, '$1.$2');
        return angka;
    }
}
function formatAngka2(angka) {
    if (typeof(angka) != 'string') angka = angka.toString();
    var reg = new RegExp('([0-9]+)([0-9]{3})');
    while (reg.test(angka)) angka = angka.replace(reg, '$1,$2');
    return angka;
}

(function ($) {
    $.fn.maskrp = function () {

        this.on('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter, dot(.) and comma(,)
            if ($.inArray(e.keyCode, [44, 46, 8, 9, 27, 13, 110, 190, 188]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }).on('blur', function (e) {
            //console.log('on blur!!!!');
            var inp = $(this).val().replace(/\./g, '');

            if (inp > 0) {
                var resRp = "";
                $(this).val("");
                inp = inp.replace("Rp ", "");
                var resRp = "Rp " + formatAngka(inp);
                $(this).val(resRp);
            } else {
                inp = inp.replace("Rp ", "");
                var resRp = "Rp " + formatAngka(inp);
                $(this).val(resRp);
            }

        }).on('focus', function (e) {
            //console.log('on focussss!!!!!');
            var inp = $(this).val().replace(/\./g, '');
            inp = inp.replace("Rp ", "");
            inp = inp.replace(".", "");
            $(this).val(inp);
        });
        return this;
    };
}(jQuery));

(function ($) {
    $.fn.masknumber = function () {

        this.on('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter, dot(.) and comma(,)
            if ($.inArray(e.keyCode, [44, 46, 8, 9, 27, 13, 110, 190, 188]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        return this;
    };
}(jQuery));


(function ($) {
    $.fn.maskPPNNumber = function () {

        this.on('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter, dot(.) and comma(,)
            if ($.inArray(e.keyCode, [44, 46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        return this;
    };
}(jQuery));

/*
 (function ( $ ) {
 $.fn.maskrp = function() {
 this.on('keypress', function(e) {
 var c = e.keyCode || e.charCode;
 switch (c) {
 case 8: case 9: case 27: case 13: return;
 case 65:
 if (e.ctrlKey === true) return;
 }
 if ((c != 44 ) && (c < 48 || c > 57)) e.preventDefault();

 var inp = $(this).val();

 var c = e.keyCode || e.charCode;
 //jika ada comma maka
 if (inp.indexOf(',') != -1) {

 //jika comma press comma lagi, maka
 if (c === 44){
 e.stopPropagation();
 e.preventDefault();
 e.returnValue = false;
 e.cancelBubble = true;
 return false;
 }

 var segments = inp.split(',');
 if (segments[1].length>=2){
 //console.log("length:" + segments[1].length);
 //console.log("e.key:" + e.keyCode);
 if (c>=48 && c <=57){
 e.stopPropagation();
 e.preventDefault();
 e.returnValue = false;
 e.cancelBubble = true;
 return false;
 }
 }
 }

 }).on('keyup', function(e) {
 var inp = $(this).val().replace(/\./g, '');

 if (inp > 0 ){
 var resRp = ""; $(this).val("");
 inp = inp.replace("Rp ", "");
 var resRp = "Rp " + formatAngka(inp);
 $(this).val(resRp);
 }else{
 var resRp = formatAngka(inp);
 $(this).val(resRp);
 }


 });
 return this;
 };
 }( jQuery ));*/
