// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { KEYWORDS } from "../parser/generated_parser.ts";
import { _switchVersion as switchTokens } from "../tokenize/tokenize.ts";

const versionInfo = { python3: true };

/**
 * the skulpt parser assumes python3.
 * @param python3 to set to python2 mode call switchVersion(false)
 */
export function switchVersion(python3 = true) {
    if (python3 === versionInfo.python3) {
        // no need to switch
        return;
    }
    if (python3) {
        KEYWORDS.delete("print");
    } else {
        KEYWORDS.add("print");
    }
    switchTokens(python3);
    versionInfo.python3 = python3;
}
