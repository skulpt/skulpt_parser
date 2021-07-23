// Copyright (c) 2021 the Skulpt Project
// SPDX-License-Identifier: MIT

import { KEYWORDS } from "../parser/generated_parser.ts";

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
    /**
     * @todo - helper function to switch somethings to py2
     *
     * py2
     * include L suffix for long literals
     * include silentOctals
     * include <> operator in tokens
     */

    if (python3) {
        KEYWORDS.delete("print");
    } else {
        KEYWORDS.add("print");
    }
    versionInfo.python3 = python3;
}
