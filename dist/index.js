/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.READONLY = exports.UV_FS_O_EXLOCK = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rm = exports.rename = exports.readlink = exports.readdir = exports.open = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises
// export const {open} = 'fs'
, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.open = _a.open, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rm = _a.rm, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
// export const {open} = 'fs'
exports.IS_WINDOWS = process.platform === 'win32';
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
exports.UV_FS_O_EXLOCK = 0x10000000;
exports.READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const path = __importStar(__nccwpck_require__(1017));
const ioUtil = __importStar(__nccwpck_require__(1962));
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 4766:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApplicativeComposition = exports.getApplicativeMonoid = void 0;
/**
 * The `Applicative` type class extends the `Apply` type class with a `of` function, which can be used to create values
 * of type `f a` from values of type `a`.
 *
 * Where `Apply` provides the ability to lift functions of two or more arguments to functions whose arguments are
 * wrapped using `f`, and `Functor` provides the ability to lift functions of one argument, `pure` can be seen as the
 * function which lifts functions of _zero_ arguments. That is, `Applicative` functors support a lifting operation for
 * any number of function arguments.
 *
 * Instances must satisfy the following laws in addition to the `Apply` laws:
 *
 * 1. Identity: `A.ap(A.of(a => a), fa) <-> fa`
 * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) <-> A.of(ab(a))`
 * 3. Interchange: `A.ap(fab, A.of(a)) <-> A.ap(A.of(ab => ab(a)), fab)`
 *
 * Note. `Functor`'s `map` can be derived: `A.map(x, f) = A.ap(A.of(f), x)`
 *
 * @since 2.0.0
 */
var Apply_1 = __nccwpck_require__(205);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
function getApplicativeMonoid(F) {
    var f = (0, Apply_1.getApplySemigroup)(F);
    return function (M) { return ({
        concat: f(M).concat,
        empty: F.of(M.empty)
    }); };
}
exports.getApplicativeMonoid = getApplicativeMonoid;
/** @deprecated */
function getApplicativeComposition(F, G) {
    var map = (0, Functor_1.getFunctorComposition)(F, G).map;
    var _ap = (0, Apply_1.ap)(F, G);
    return {
        map: map,
        of: function (a) { return F.of(G.of(a)); },
        ap: function (fgab, fga) { return (0, function_1.pipe)(fgab, _ap(fga)); }
    };
}
exports.getApplicativeComposition = getApplicativeComposition;


/***/ }),

/***/ 205:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sequenceS = exports.sequenceT = exports.getApplySemigroup = exports.apS = exports.apSecond = exports.apFirst = exports.ap = void 0;
/**
 * The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
 *
 * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
 * `f`.
 *
 * Instances must satisfy the following law in addition to the `Functor` laws:
 *
 * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) <-> F.ap(fbc, F.ap(fab, fa))`
 *
 * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * const f = (a: string) => (b: number) => (c: boolean) => a + String(b) + String(c)
 * const fa: O.Option<string> = O.some('s')
 * const fb: O.Option<number> = O.some(1)
 * const fc: O.Option<boolean> = O.some(true)
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     // lift a function
 *     O.some(f),
 *     // apply the first argument
 *     O.ap(fa),
 *     // apply the second argument
 *     O.ap(fb),
 *     // apply the third argument
 *     O.ap(fc)
 *   ),
 *   O.some('s1true')
 * )
 *
 * @since 2.0.0
 */
var function_1 = __nccwpck_require__(6985);
var _ = __importStar(__nccwpck_require__(1840));
function ap(F, G) {
    return function (fa) {
        return function (fab) {
            return F.ap(F.map(fab, function (gab) { return function (ga) { return G.ap(gab, ga); }; }), fa);
        };
    };
}
exports.ap = ap;
function apFirst(A) {
    return function (second) { return function (first) {
        return A.ap(A.map(first, function (a) { return function () { return a; }; }), second);
    }; };
}
exports.apFirst = apFirst;
function apSecond(A) {
    return function (second) {
        return function (first) {
            return A.ap(A.map(first, function () { return function (b) { return b; }; }), second);
        };
    };
}
exports.apSecond = apSecond;
function apS(F) {
    return function (name, fb) {
        return function (fa) {
            return F.ap(F.map(fa, function (a) { return function (b) {
                var _a;
                return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
            }; }), fb);
        };
    };
}
exports.apS = apS;
function getApplySemigroup(F) {
    return function (S) { return ({
        concat: function (first, second) {
            return F.ap(F.map(first, function (x) { return function (y) { return S.concat(x, y); }; }), second);
        }
    }); };
}
exports.getApplySemigroup = getApplySemigroup;
function curried(f, n, acc) {
    return function (x) {
        var combined = Array(acc.length + 1);
        for (var i = 0; i < acc.length; i++) {
            combined[i] = acc[i];
        }
        combined[acc.length] = x;
        return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
    };
}
var tupleConstructors = {
    1: function (a) { return [a]; },
    2: function (a) { return function (b) { return [a, b]; }; },
    3: function (a) { return function (b) { return function (c) { return [a, b, c]; }; }; },
    4: function (a) { return function (b) { return function (c) { return function (d) { return [a, b, c, d]; }; }; }; },
    5: function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return [a, b, c, d, e]; }; }; }; }; }
};
function getTupleConstructor(len) {
    if (!_.has.call(tupleConstructors, len)) {
        tupleConstructors[len] = curried(function_1.tuple, len - 1, []);
    }
    return tupleConstructors[len];
}
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = getTupleConstructor(len);
        var fas = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
        }
        return fas;
    };
}
exports.sequenceT = sequenceT;
function getRecordConstructor(keys) {
    var len = keys.length;
    switch (len) {
        case 1:
            return function (a) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a);
            };
        case 2:
            return function (a) { return function (b) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a);
            }; };
        case 3:
            return function (a) { return function (b) { return function (c) {
                var _a;
                return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a);
            }; }; };
        case 4:
            return function (a) { return function (b) { return function (c) { return function (d) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a);
            }; }; }; };
        case 5:
            return function (a) { return function (b) { return function (c) { return function (d) { return function (e) {
                var _a;
                return (_a = {},
                    _a[keys[0]] = a,
                    _a[keys[1]] = b,
                    _a[keys[2]] = c,
                    _a[keys[3]] = d,
                    _a[keys[4]] = e,
                    _a);
            }; }; }; }; };
        default:
            return curried(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var r = {};
                for (var i = 0; i < len; i++) {
                    r[keys[i]] = args[i];
                }
                return r;
            }, len - 1, []);
    }
}
function sequenceS(F) {
    return function (r) {
        var keys = Object.keys(r);
        var len = keys.length;
        var f = getRecordConstructor(keys);
        var fr = F.map(r[keys[0]], f);
        for (var i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
        }
        return fr;
    };
}
exports.sequenceS = sequenceS;


/***/ }),

/***/ 2372:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bind = exports.tap = exports.chainFirst = void 0;
function chainFirst(M) {
    var tapM = tap(M);
    return function (f) { return function (first) { return tapM(first, f); }; };
}
exports.chainFirst = chainFirst;
/** @internal */
function tap(M) {
    return function (first, f) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); };
}
exports.tap = tap;
function bind(M) {
    return function (name, f) { return function (ma) { return M.chain(ma, function (a) { return M.map(f(a), function (b) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
    }); }); }; };
}
exports.bind = bind;


/***/ }),

/***/ 5322:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tailRec = void 0;
/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
    var ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};
exports.tailRec = tailRec;


/***/ }),

/***/ 729:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCompactableComposition = exports.separate = exports.compact = void 0;
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var Option_1 = __nccwpck_require__(2569);
var S = __importStar(__nccwpck_require__(5877));
function compact(F, G) {
    return function (fga) { return F.map(fga, G.compact); };
}
exports.compact = compact;
function separate(F, C, G) {
    var _compact = compact(F, C);
    var _map = (0, Functor_1.map)(F, G);
    return function (fge) { return S.separated(_compact((0, function_1.pipe)(fge, _map(Option_1.getLeft))), _compact((0, function_1.pipe)(fge, _map(Option_1.getRight)))); };
}
exports.separate = separate;
/** @deprecated */
function getCompactableComposition(F, G) {
    var map = (0, Functor_1.getFunctorComposition)(F, G).map;
    return {
        map: map,
        compact: compact(F, G),
        separate: separate(F, G, G)
    };
}
exports.getCompactableComposition = getCompactableComposition;


/***/ }),

/***/ 7534:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.match = exports.foldW = exports.matchW = exports.isRight = exports.isLeft = exports.fromOption = exports.fromPredicate = exports.FromEither = exports.MonadThrow = exports.throwError = exports.ChainRec = exports.Extend = exports.extend = exports.Alt = exports.alt = exports.altW = exports.Bifunctor = exports.mapLeft = exports.bimap = exports.Traversable = exports.sequence = exports.traverse = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.Applicative = exports.Apply = exports.ap = exports.apW = exports.Pointed = exports.of = exports.asUnit = exports.as = exports.Functor = exports.map = exports.getAltValidation = exports.getApplicativeValidation = exports.getWitherable = exports.getFilterable = exports.getCompactable = exports.getSemigroup = exports.getEq = exports.getShow = exports.URI = exports.flatMap = exports.right = exports.left = void 0;
exports.chainFirstW = exports.chainFirst = exports.chain = exports.chainW = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports["let"] = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toError = exports.toUnion = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.orElse = exports.orElseW = exports.swap = exports.filterOrElseW = exports.filterOrElse = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.chainOptionKW = exports.chainOptionK = exports.fromOptionK = exports.duplicate = exports.flatten = exports.flattenW = exports.tap = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = exports.fold = void 0;
exports.getValidation = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.either = exports.stringifyJSON = exports.parseJSON = void 0;
var Applicative_1 = __nccwpck_require__(4766);
var Apply_1 = __nccwpck_require__(205);
var chainable = __importStar(__nccwpck_require__(2372));
var ChainRec_1 = __nccwpck_require__(5322);
var FromEither_1 = __nccwpck_require__(1964);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var _ = __importStar(__nccwpck_require__(1840));
var Separated_1 = __nccwpck_require__(5877);
var Witherable_1 = __nccwpck_require__(4384);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.left = _.left;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.right = _.right;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) { return ((0, exports.isLeft)(ma) ? ma : f(ma.right)); });
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) { return function (fa, f) {
    var foldMapM = (0, exports.foldMap)(M);
    return (0, function_1.pipe)(fa, foldMapM(f));
}; };
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
var _traverse = function (F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
};
var _bimap = function (fa, f, g) { return (0, function_1.pipe)(fa, (0, exports.bimap)(f, g)); };
var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapLeft)(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
var _chainRec = function (a, f) {
    return (0, ChainRec_1.tailRec)(f(a), function (e) {
        return (0, exports.isLeft)(e) ? (0, exports.right)((0, exports.left)(e.left)) : (0, exports.isLeft)(e.right) ? (0, exports.left)(f(e.right.left)) : (0, exports.right)((0, exports.right)(e.right.right));
    });
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = function (SE, SA) { return ({
    show: function (ma) { return ((0, exports.isLeft)(ma) ? "left(".concat(SE.show(ma.left), ")") : "right(".concat(SA.show(ma.right), ")")); }
}); };
exports.getShow = getShow;
/**
 * @category instances
 * @since 2.0.0
 */
var getEq = function (EL, EA) { return ({
    equals: function (x, y) {
        return x === y || ((0, exports.isLeft)(x) ? (0, exports.isLeft)(y) && EL.equals(x.left, y.left) : (0, exports.isRight)(y) && EA.equals(x.right, y.right));
    }
}); };
exports.getEq = getEq;
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function (S) { return ({
    concat: function (x, y) { return ((0, exports.isLeft)(y) ? x : (0, exports.isLeft)(x) ? y : (0, exports.right)(S.concat(x.right, y.right))); }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var empty = (0, exports.left)(M.empty);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: function (ma) { return ((0, exports.isLeft)(ma) ? ma : ma.right._tag === 'None' ? empty : (0, exports.right)(ma.right.value)); },
        separate: function (ma) {
            return (0, exports.isLeft)(ma)
                ? (0, Separated_1.separated)(ma, ma)
                : (0, exports.isLeft)(ma.right)
                    ? (0, Separated_1.separated)((0, exports.right)(ma.right.left), empty)
                    : (0, Separated_1.separated)(empty, (0, exports.right)(ma.right.right));
        }
    };
};
exports.getCompactable = getCompactable;
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.10.0
 */
var getFilterable = function (M) {
    var empty = (0, exports.left)(M.empty);
    var _a = (0, exports.getCompactable)(M), compact = _a.compact, separate = _a.separate;
    var filter = function (ma, predicate) {
        return (0, exports.isLeft)(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    var partition = function (ma, p) {
        return (0, exports.isLeft)(ma)
            ? (0, Separated_1.separated)(ma, ma)
            : p(ma.right)
                ? (0, Separated_1.separated)(empty, (0, exports.right)(ma.right))
                : (0, Separated_1.separated)((0, exports.right)(ma.right), empty);
    };
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: function (ma, f) {
            if ((0, exports.isLeft)(ma)) {
                return ma;
            }
            var ob = f(ma.right);
            return ob._tag === 'None' ? empty : (0, exports.right)(ob.value);
        },
        partition: partition,
        partitionMap: function (ma, f) {
            if ((0, exports.isLeft)(ma)) {
                return (0, Separated_1.separated)(ma, ma);
            }
            var e = f(ma.right);
            return (0, exports.isLeft)(e) ? (0, Separated_1.separated)((0, exports.right)(e.left), empty) : (0, Separated_1.separated)(empty, (0, exports.right)(e.right));
        }
    };
};
exports.getFilterable = getFilterable;
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category filtering
 * @since 2.0.0
 */
var getWitherable = function (M) {
    var F_ = (0, exports.getFilterable)(M);
    var C = (0, exports.getCompactable)(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: F_.compact,
        separate: F_.separate,
        filter: F_.filter,
        filterMap: F_.filterMap,
        partition: F_.partition,
        partitionMap: F_.partitionMap,
        traverse: _traverse,
        sequence: exports.sequence,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        wither: (0, Witherable_1.witherDefault)(exports.Traversable, C),
        wilt: (0, Witherable_1.wiltDefault)(exports.Traversable, C)
    };
};
exports.getWitherable = getWitherable;
/**
 * The default [`Applicative`](#applicative) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as A from 'fp-ts/Apply'
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 *
 * const parsePerson = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     E.apS('name', parseString(input.name)),
 *     E.apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePerson({}), E.left('not a string')) // <= first error
 *
 * const Applicative = E.getApplicativeValidation(
 *   pipe(string.Semigroup, S.intercalate(', '))
 * )
 *
 * const apS = A.apS(Applicative)
 *
 * const parsePersonAll = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     apS('name', parseString(input.name)),
 *     apS('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
var getApplicativeValidation = function (SE) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    ap: function (fab, fa) {
        return (0, exports.isLeft)(fab)
            ? (0, exports.isLeft)(fa)
                ? (0, exports.left)(SE.concat(fab.left, fa.left))
                : fab
            : (0, exports.isLeft)(fa)
                ? fa
                : (0, exports.right)(fab.right(fa.right));
    },
    of: exports.of
}); };
exports.getApplicativeValidation = getApplicativeValidation;
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * const parse = (u: unknown): E.Either<string, string | number> =>
 *   pipe(
 *     parseString(u),
 *     E.alt<string, string | number>(() => parseNumber(u))
 *   )
 *
 * assert.deepStrictEqual(parse(true), E.left('not a number')) // <= last error
 *
 * const Alt = E.getAltValidation(pipe(string.Semigroup, S.intercalate(', ')))
 *
 * const parseAll = (u: unknown): E.Either<string, string | number> =>
 *   Alt.alt<string | number>(parseString(u), () => parseNumber(u))
 *
 * assert.deepStrictEqual(parseAll(true), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 2.7.0
 */
var getAltValidation = function (SE) { return ({
    URI: exports.URI,
    _E: undefined,
    map: _map,
    alt: function (me, that) {
        if ((0, exports.isRight)(me)) {
            return me;
        }
        var ea = that();
        return (0, exports.isLeft)(ea) ? (0, exports.left)(SE.concat(me.left, ea.left)) : ea;
    }
}); };
exports.getAltValidation = getAltValidation;
/**
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? fa : (0, exports.right)(f(fa.right));
}; };
exports.map = map;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Right` value of this `Either` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Right` value of this `Either` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category constructors
 * @since 2.7.0
 */
exports.of = exports.right;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
var apW = function (fa) { return function (fab) {
    return (0, exports.isLeft)(fab) ? fab : (0, exports.isLeft)(fa) ? fa : (0, exports.right)(fab.right(fa.right));
}; };
exports.apW = apW;
/**
 * @since 2.0.0
 */
exports.ap = exports.apW;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? b : f(b, fa.right);
}; };
exports.reduce = reduce;
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? M.empty : f(fa.right);
}; }; };
exports.foldMap = foldMap;
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category folding
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? b : f(fa.right, b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) {
        return function (ta) {
            return (0, exports.isLeft)(ta) ? F.of((0, exports.left)(ta.left)) : F.map(f(ta.right), exports.right);
        };
    };
};
exports.traverse = traverse;
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? F.of((0, exports.left)(ma.left)) : F.map(ma.right, exports.right);
    };
};
exports.sequence = sequence;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) {
    return (0, exports.isLeft)(fa) ? (0, exports.left)(f(fa.left)) : (0, exports.right)(g(fa.right));
}; };
exports.bimap = bimap;
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return (0, exports.isLeft)(fa) ? (0, exports.left)(f(fa.left)) : fa;
}; };
exports.mapLeft = mapLeft;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
var altW = function (that) { return function (fa) {
    return (0, exports.isLeft)(fa) ? that() : fa;
}; };
exports.altW = altW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).
 *
 * | x        | y        | pipe(x, alt(() => y) |
 * | -------- | -------- | -------------------- |
 * | left(a)  | left(b)  | left(b)              |
 * | left(a)  | right(2) | right(2)             |
 * | right(1) | left(b)  | right(1)             |
 * | right(1) | right(2) | right(1)             |
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.left('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(2)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.left('b'))
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.alt(() => E.right(2))
 *   ),
 *   E.right(1)
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.alt = exports.altW;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return (0, exports.isLeft)(wa) ? wa : (0, exports.right)(f(wa));
}; };
exports.extend = extend;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: _map,
    extend: _extend
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ChainRec = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap,
    chainRec: _chainRec
};
/**
 * @since 2.6.3
 */
exports.throwError = exports.left;
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
    throwError: exports.throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: function_1.identity
};
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category lifting
 * @since 2.0.0
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/ (0, FromEither_1.fromOption)(exports.FromEither);
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isLeft = _.isLeft;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isRight = _.isRight;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
var matchW = function (onLeft, onRight) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? onLeft(ma.left) : onRight(ma.right);
    };
};
exports.matchW = matchW;
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchW;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = exports.matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.fold = exports.match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
var getOrElseW = function (onLeft) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? onLeft(ma.left) : ma.right;
    };
};
exports.getOrElseW = getOrElseW;
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Less strict version of [`apFirst`](#apfirst)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apFirstW = exports.apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * Less strict version of [`apSecond`](#apsecond)
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecondW = exports.apSecond;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
exports.tap = (0, function_1.dual)(2, chainable.tap(exports.Chain));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/ (0, exports.flatMap)(function_1.identity);
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * @since 2.0.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/ (0, FromEither_1.fromOptionK)(exports.FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainOptionK = (0, FromEither_1.chainOptionK)(exports.FromEither, exports.Chain);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
exports.chainOptionKW = exports.chainOptionK;
/** @internal */
var _FromEither = {
    fromEither: exports.FromEither.fromEither
};
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftNullable = _.liftNullable(_FromEither);
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftOption = _.liftOption(_FromEither);
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapNullable = _.flatMapNullable(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapOption = _.flatMapOption(_FromEither, _FlatMap);
/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
exports.filterOrElse = (0, FromEither_1.filterOrElse)(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @since 2.0.0
 */
var swap = function (ma) { return ((0, exports.isLeft)(ma) ? (0, exports.right)(ma.left) : (0, exports.left)(ma.right)); };
exports.swap = swap;
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
var orElseW = function (onLeft) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? onLeft(ma.left) : ma;
    };
};
exports.orElseW = orElseW;
/**
 * Useful for recovering from errors.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = exports.orElseW;
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category conversions
 * @since 2.0.0
 */
var fromNullable = function (e) {
    return function (a) {
        return a == null ? (0, exports.left)(e) : (0, exports.right)(a);
    };
};
exports.fromNullable = fromNullable;
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) {
    try {
        return (0, exports.right)(f());
    }
    catch (e) {
        return (0, exports.left)(onThrow(e));
    }
};
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.tryCatch)(function () { return f.apply(void 0, a); }, onThrow);
    };
};
exports.tryCatchK = tryCatchK;
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.9.0
 */
var fromNullableK = function (e) {
    var from = (0, exports.fromNullable)(e);
    return function (f) { return (0, function_1.flow)(f, from); };
};
exports.fromNullableK = fromNullableK;
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.9.0
 */
var chainNullableK = function (e) {
    var from = (0, exports.fromNullableK)(e);
    return function (f) { return (0, exports.flatMap)(from(f)); };
};
exports.chainNullableK = chainNullableK;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.toUnion = (0, exports.foldW)(function_1.identity, function_1.identity);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
exports.toError = toError;
function elem(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return (0, exports.isLeft)(ma) ? false : E.equals(a, ma.right);
    };
}
exports.elem = elem;
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
var exists = function (predicate) {
    return function (ma) {
        return (0, exports.isLeft)(ma) ? false : predicate(ma.right);
    };
};
exports.exists = exists;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports["let"] = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.bindW = exports.bind;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apSW = exports.apS;
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        var e = f(0, _.head(as));
        if ((0, exports.isLeft)(e)) {
            return e;
        }
        var out = [e.right];
        for (var i = 1; i < as.length; i++) {
            var e_1 = f(i, as[i]);
            if ((0, exports.isLeft)(e_1)) {
                return e_1;
            }
            out.push(e_1.right);
        }
        return (0, exports.right)(out);
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
exports.chainW = exports.flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chainFirst = exports.tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
exports.chainFirstW = exports.tap;
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function parseJSON(s, onError) {
    return (0, exports.tryCatch)(function () { return JSON.parse(s); }, onError);
}
exports.parseJSON = parseJSON;
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
    return (0, exports.tryCatch)(function () {
        var s = JSON.stringify(u);
        if (typeof s !== 'string') {
            throw new Error('Converting unsupported structure to JSON');
        }
        return s;
    }, onError);
};
exports.stringifyJSON = stringifyJSON;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `E.Functor` instead of `E.either`
 * (where `E` is from `import E from 'fp-ts/Either'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.either = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    extend: _extend,
    chainRec: _chainRec,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/ (0, Apply_1.getApplySemigroup)(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/ (0, Applicative_1.getApplicativeMonoid)(exports.Applicative);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getValidationSemigroup = function (SE, SA) {
    return (0, Apply_1.getApplySemigroup)((0, exports.getApplicativeValidation)(SE))(SA);
};
exports.getValidationSemigroup = getValidationSemigroup;
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getValidationMonoid = function (SE, MA) {
    return (0, Applicative_1.getApplicativeMonoid)((0, exports.getApplicativeValidation)(SE))(MA);
};
exports.getValidationMonoid = getValidationMonoid;
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function getValidation(SE) {
    var ap = (0, exports.getApplicativeValidation)(SE).ap;
    var alt = (0, exports.getAltValidation)(SE).alt;
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        of: exports.of,
        chain: exports.flatMap,
        bimap: _bimap,
        mapLeft: _mapLeft,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        extend: _extend,
        traverse: _traverse,
        sequence: exports.sequence,
        chainRec: _chainRec,
        throwError: exports.throwError,
        ap: ap,
        alt: alt
    };
}
exports.getValidation = getValidation;


/***/ }),

/***/ 9803:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEitherM = exports.toUnion = exports.swap = exports.orLeft = exports.tapError = exports.orElseFirst = exports.orElse = exports.getOrElse = exports.matchE = exports.match = exports.altValidation = exports.mapError = exports.mapLeft = exports.mapBoth = exports.bimap = exports.alt = exports.flatMap = exports.chain = exports.ap = exports.map = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.leftF = exports.rightF = exports.left = exports.right = void 0;
var Apply_1 = __nccwpck_require__(205);
var E = __importStar(__nccwpck_require__(7534));
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
function right(F) {
    return (0, function_1.flow)(E.right, F.of);
}
exports.right = right;
function left(F) {
    return (0, function_1.flow)(E.left, F.of);
}
exports.left = left;
function rightF(F) {
    return function (fa) { return F.map(fa, E.right); };
}
exports.rightF = rightF;
function leftF(F) {
    return function (fe) { return F.map(fe, E.left); };
}
exports.leftF = leftF;
function fromNullable(F) {
    return function (e) { return (0, function_1.flow)(E.fromNullable(e), F.of); };
}
exports.fromNullable = fromNullable;
function fromNullableK(F) {
    var fromNullableF = fromNullable(F);
    return function (e) {
        var fromNullableFE = fromNullableF(e);
        return function (f) { return (0, function_1.flow)(f, fromNullableFE); };
    };
}
exports.fromNullableK = fromNullableK;
function chainNullableK(M) {
    var chainM = chain(M);
    var fromNullableKM = fromNullableK(M);
    return function (e) {
        var fromNullableKMe = fromNullableKM(e);
        return function (f) { return chainM(fromNullableKMe(f)); };
    };
}
exports.chainNullableK = chainNullableK;
function map(F) {
    return (0, Functor_1.map)(F, E.Functor);
}
exports.map = map;
function ap(F) {
    return (0, Apply_1.ap)(F, E.Apply);
}
exports.ap = ap;
function chain(M) {
    var flatMapM = flatMap(M);
    return function (f) { return function (ma) { return flatMapM(ma, f); }; };
}
exports.chain = chain;
/** @internal */
function flatMap(M) {
    return function (ma, f) { return M.chain(ma, function (e) { return (E.isLeft(e) ? M.of(e) : f(e.right)); }); };
}
exports.flatMap = flatMap;
function alt(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (E.isLeft(e) ? second() : M.of(e)); }); }; };
}
exports.alt = alt;
function bimap(F) {
    var mapBothF = mapBoth(F);
    return function (f, g) { return function (self) { return mapBothF(self, f, g); }; };
}
exports.bimap = bimap;
/** @internal */
function mapBoth(F) {
    return function (self, f, g) { return F.map(self, E.bimap(f, g)); };
}
exports.mapBoth = mapBoth;
function mapLeft(F) {
    var mapErrorF = mapError(F);
    return function (f) { return function (self) { return mapErrorF(self, f); }; };
}
exports.mapLeft = mapLeft;
/** @internal */
function mapError(F) {
    return function (self, f) { return F.map(self, E.mapLeft(f)); };
}
exports.mapError = mapError;
function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, E.match(function (e1) {
            return M.map(second(), E.mapLeft(function (e2) { return S.concat(e1, e2); }));
        }, right(M)));
    }; };
}
exports.altValidation = altValidation;
function match(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, E.match(onLeft, onRight)); }; };
}
exports.match = match;
function matchE(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, E.match(onLeft, onRight)); }; };
}
exports.matchE = matchE;
function getOrElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, E.match(onLeft, M.of)); }; };
}
exports.getOrElse = getOrElse;
function orElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
exports.orElse = orElse;
function orElseFirst(M) {
    var tapErrorM = tapError(M);
    return function (onLeft) { return function (ma) { return tapErrorM(ma, onLeft); }; };
}
exports.orElseFirst = orElseFirst;
/** @internal */
function tapError(M) {
    var orElseM = orElse(M);
    return function (ma, onLeft) {
        return (0, function_1.pipe)(ma, orElseM(function (e) { return M.map(onLeft(e), function (eb) { return (E.isLeft(eb) ? eb : E.left(e)); }); }));
    };
}
exports.tapError = tapError;
function orLeft(M) {
    return function (onLeft) { return function (ma) {
        return M.chain(ma, E.match(function (e) { return M.map(onLeft(e), E.left); }, function (a) { return M.of(E.right(a)); }));
    }; };
}
exports.orLeft = orLeft;
function swap(F) {
    return function (ma) { return F.map(ma, E.swap); };
}
exports.swap = swap;
function toUnion(F) {
    return function (fa) { return F.map(fa, E.toUnion); };
}
exports.toUnion = toUnion;
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _alt = alt(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _getOrElse = getOrElse(M);
    var _orElse = orElse(M);
    return {
        map: function (fa, f) { return (0, function_1.pipe)(fa, _map(f)); },
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, _ap(fa)); },
        of: right(M),
        chain: function (ma, f) { return (0, function_1.pipe)(ma, _chain(f)); },
        alt: function (fa, that) { return (0, function_1.pipe)(fa, _alt(that)); },
        bimap: function (fea, f, g) { return (0, function_1.pipe)(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return (0, function_1.pipe)(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return (0, function_1.pipe)(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return (0, function_1.pipe)(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return (0, function_1.pipe)(fa, _orElse(f)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
exports.getEitherM = getEitherM;


/***/ }),

/***/ 6964:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eqDate = exports.eqNumber = exports.eqString = exports.eqBoolean = exports.eq = exports.strictEqual = exports.getStructEq = exports.getTupleEq = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.eqStrict = exports.URI = exports.contramap = exports.tuple = exports.struct = exports.fromEquals = void 0;
var function_1 = __nccwpck_require__(6985);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromEquals = function (equals) { return ({
    equals: function (x, y) { return x === y || equals(x, y); }
}); };
exports.fromEquals = fromEquals;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var struct = function (eqs) {
    return (0, exports.fromEquals)(function (first, second) {
        for (var key in eqs) {
            if (!eqs[key].equals(first[key], second[key])) {
                return false;
            }
        }
        return true;
    });
};
exports.struct = struct;
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.10.0
 */
var tuple = function () {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return (0, exports.fromEquals)(function (first, second) { return eqs.every(function (E, i) { return E.equals(first[i], second[i]); }); });
};
exports.tuple = tuple;
/* istanbul ignore next */
var contramap_ = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.contramap)(f)); };
/**
 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Eq<User>`.
 *
 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
 * for equality (meaning we have an `Eq<X>`)
 *
 * For example, given the following `User` type, we want to construct an `Eq<User>` that just looks at the `key` field
 * for each user (since it's known to be unique).
 *
 * If we have a way of comparing `UUID`s for equality (`eqUUID: Eq<UUID>`) and we know how to go from `User -> UUID`,
 * using `contramap` we can do this
 *
 * @example
 * import { contramap, Eq } from 'fp-ts/Eq'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/string'
 *
 * type UUID = string
 *
 * interface User {
 *   readonly key: UUID
 *   readonly firstName: string
 *   readonly lastName: string
 * }
 *
 * const eqUUID: Eq<UUID> = S.Eq
 *
 * const eqUserByKey: Eq<User> = pipe(
 *   eqUUID,
 *   contramap((user) => user.key)
 * )
 *
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k2', firstName: 'a1', lastName: 'b1' }
 *   ),
 *   false
 * )
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k1', firstName: 'a2', lastName: 'b1' }
 *   ),
 *   true
 * )
 *
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return (0, exports.fromEquals)(function (x, y) { return fa.equals(f(x), f(y)); });
}; };
exports.contramap = contramap;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Eq';
/**
 * @category instances
 * @since 2.5.0
 */
exports.eqStrict = {
    equals: function (a, b) { return a === b; }
};
var empty = {
    equals: function () { return true; }
};
/**
 * @category instances
 * @since 2.10.0
 */
var getSemigroup = function () { return ({
    concat: function (x, y) { return (0, exports.fromEquals)(function (a, b) { return x.equals(a, b) && y.equals(a, b); }); }
}); };
exports.getSemigroup = getSemigroup;
/**
 * @category instances
 * @since 2.6.0
 */
var getMonoid = function () { return ({
    concat: (0, exports.getSemigroup)().concat,
    empty: empty
}); };
exports.getMonoid = getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleEq = exports.tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructEq = exports.struct;
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.strictEqual = exports.eqStrict.equals;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Contravariant` instance, pass `E.Contravariant` instead of `E.eq`
 * (where `E` is from `import E from 'fp-ts/Eq'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eq = exports.Contravariant;
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqBoolean = exports.eqStrict;
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqString = exports.eqStrict;
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqNumber = exports.eqStrict;
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.eqDate = {
    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
};


/***/ }),

/***/ 6907:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFilterableComposition = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = void 0;
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
var Compactable_1 = __nccwpck_require__(729);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var Option_1 = __nccwpck_require__(2569);
var Predicate_1 = __nccwpck_require__(6382);
var Separated_1 = __nccwpck_require__(5877);
function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
exports.filter = filter;
function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
exports.filterMap = filterMap;
function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) {
        var left = _filter((0, Predicate_1.not)(predicate));
        var right = _filter(predicate);
        return function (fgb) { return (0, Separated_1.separated)(left(fgb), right(fgb)); };
    };
}
exports.partition = partition;
function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return (0, Separated_1.separated)((0, function_1.pipe)(fga, _filterMap(function (a) { return (0, Option_1.getLeft)(f(a)); })), (0, function_1.pipe)(fga, _filterMap(function (a) { return (0, Option_1.getRight)(f(a)); })));
    }; };
}
exports.partitionMap = partitionMap;
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = (0, Functor_1.getFunctorComposition)(F, G).map;
    var _compact = (0, Compactable_1.compact)(F, G);
    var _separate = (0, Compactable_1.separate)(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return (0, function_1.pipe)(fga, _filter(f)); },
        filterMap: function (fga, f) { return (0, function_1.pipe)(fga, _filterMap(f)); },
        partition: function (fga, p) { return (0, function_1.pipe)(fga, _partition(p)); },
        partitionMap: function (fga, f) { return (0, function_1.pipe)(fga, _partitionMap(f)); }
    };
}
exports.getFilterableComposition = getFilterableComposition;


/***/ }),

/***/ 1964:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tapEither = exports.filterOrElse = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromPredicate = exports.fromOption = void 0;
var Chain_1 = __nccwpck_require__(2372);
var function_1 = __nccwpck_require__(6985);
var _ = __importStar(__nccwpck_require__(1840));
function fromOption(F) {
    return function (onNone) { return function (ma) { return F.fromEither(_.isNone(ma) ? _.left(onNone()) : _.right(ma.value)); }; };
}
exports.fromOption = fromOption;
function fromPredicate(F) {
    return function (predicate, onFalse) {
        return function (a) {
            return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
        };
    };
}
exports.fromPredicate = fromPredicate;
function fromOptionK(F) {
    var fromOptionF = fromOption(F);
    return function (onNone) {
        var from = fromOptionF(onNone);
        return function (f) { return (0, function_1.flow)(f, from); };
    };
}
exports.fromOptionK = fromOptionK;
function chainOptionK(F, M) {
    var fromOptionKF = fromOptionK(F);
    return function (onNone) {
        var from = fromOptionKF(onNone);
        return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
    };
}
exports.chainOptionK = chainOptionK;
function fromEitherK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromEither); };
}
exports.fromEitherK = fromEitherK;
function chainEitherK(F, M) {
    var fromEitherKF = fromEitherK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
}
exports.chainEitherK = chainEitherK;
function chainFirstEitherK(F, M) {
    var tapEitherM = tapEither(F, M);
    return function (f) { return function (ma) { return tapEitherM(ma, f); }; };
}
exports.chainFirstEitherK = chainFirstEitherK;
function filterOrElse(F, M) {
    return function (predicate, onFalse) {
        return function (ma) {
            return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a))); });
        };
    };
}
exports.filterOrElse = filterOrElse;
/** @internal */
function tapEither(F, M) {
    var fromEither = fromEitherK(F);
    var tapM = (0, Chain_1.tap)(M);
    return function (self, f) { return tapM(self, fromEither(f)); };
}
exports.tapEither = tapEither;


/***/ }),

/***/ 7948:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tapIO = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = void 0;
/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */
var Chain_1 = __nccwpck_require__(2372);
var function_1 = __nccwpck_require__(6985);
function fromIOK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromIO); };
}
exports.fromIOK = fromIOK;
function chainIOK(F, M) {
    return function (f) {
        var g = (0, function_1.flow)(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
exports.chainIOK = chainIOK;
function chainFirstIOK(F, M) {
    var tapIOM = tapIO(F, M);
    return function (f) { return function (first) { return tapIOM(first, f); }; };
}
exports.chainFirstIOK = chainFirstIOK;
/** @internal */
function tapIO(F, M) {
    var chainFirstM = (0, Chain_1.tap)(M);
    return function (self, f) { return chainFirstM(self, (0, function_1.flow)(f, F.fromIO)); };
}
exports.tapIO = tapIO;


/***/ }),

/***/ 2038:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tapTask = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = void 0;
/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */
var Chain_1 = __nccwpck_require__(2372);
var function_1 = __nccwpck_require__(6985);
function fromTaskK(F) {
    return function (f) { return (0, function_1.flow)(f, F.fromTask); };
}
exports.fromTaskK = fromTaskK;
function chainTaskK(F, M) {
    return function (f) {
        var g = (0, function_1.flow)(f, F.fromTask);
        return function (first) { return M.chain(first, g); };
    };
}
exports.chainTaskK = chainTaskK;
function chainFirstTaskK(F, M) {
    var tapTaskM = tapTask(F, M);
    return function (f) { return function (first) { return tapTaskM(first, f); }; };
}
exports.chainFirstTaskK = chainFirstTaskK;
/** @internal */
function tapTask(F, M) {
    var tapM = (0, Chain_1.tap)(M);
    return function (self, f) { return tapM(self, (0, function_1.flow)(f, F.fromTask)); };
}
exports.tapTask = tapTask;


/***/ }),

/***/ 5533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asUnit = exports.as = exports.getFunctorComposition = exports["let"] = exports.bindTo = exports.flap = exports.map = void 0;
/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */
var function_1 = __nccwpck_require__(6985);
function map(F, G) {
    return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
}
exports.map = map;
function flap(F) {
    return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
}
exports.flap = flap;
function bindTo(F) {
    return function (name) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return (_a = {}, _a[name] = a, _a);
    }); }; };
}
exports.bindTo = bindTo;
function let_(F) {
    return function (name, f) { return function (fa) { return F.map(fa, function (a) {
        var _a;
        return Object.assign({}, a, (_a = {}, _a[name] = f(a), _a));
    }); }; };
}
exports["let"] = let_;
/** @deprecated */
function getFunctorComposition(F, G) {
    var _map = map(F, G);
    return {
        map: function (fga, f) { return (0, function_1.pipe)(fga, _map(f)); }
    };
}
exports.getFunctorComposition = getFunctorComposition;
/** @internal */
function as(F) {
    return function (self, b) { return F.map(self, function () { return b; }); };
}
exports.as = as;
/** @internal */
function asUnit(F) {
    var asM = as(F);
    return function (self) { return asM(self, undefined); };
}
exports.asUnit = asUnit;


/***/ }),

/***/ 179:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * A `Magma` is a pair `(A, concat)` in which `A` is a non-empty set and `concat` is a binary operation on `A`
 *
 * See [Semigroup](https://gcanti.github.io/fp-ts/modules/Semigroup.ts.html) for some instances.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.concatAll = exports.endo = exports.filterSecond = exports.filterFirst = exports.reverse = void 0;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Magma`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse, concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(reverse(N.MagmaSub))(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), 2)
 *
 * @since 2.11.0
 */
var reverse = function (M) { return ({
    concat: function (first, second) { return M.concat(second, first); }
}); };
exports.reverse = reverse;
/**
 * @since 2.11.0
 */
var filterFirst = function (predicate) {
    return function (M) { return ({
        concat: function (first, second) { return (predicate(first) ? M.concat(first, second) : second); }
    }); };
};
exports.filterFirst = filterFirst;
/**
 * @since 2.11.0
 */
var filterSecond = function (predicate) {
    return function (M) { return ({
        concat: function (first, second) { return (predicate(second) ? M.concat(first, second) : first); }
    }); };
};
exports.filterSecond = filterSecond;
/**
 * @since 2.11.0
 */
var endo = function (f) {
    return function (M) { return ({
        concat: function (first, second) { return M.concat(f(first), f(second)); }
    }); };
};
exports.endo = endo;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Magma'
 * import * as N from 'fp-ts/number'
 *
 * const subAll = concatAll(N.MagmaSub)(0)
 *
 * assert.deepStrictEqual(subAll([1, 2, 3]), -6)
 *
 * @since 2.11.0
 */
var concatAll = function (M) {
    return function (startWith) {
        return function (as) {
            return as.reduce(function (a, acc) { return M.concat(a, acc); }, startWith);
        };
    };
};
exports.concatAll = concatAll;


/***/ }),

/***/ 2569:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Witherable = exports.wilt = exports.wither = exports.Traversable = exports.sequence = exports.traverse = exports.Filterable = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Compactable = exports.separate = exports.compact = exports.Extend = exports.extend = exports.Alternative = exports.guard = exports.Zero = exports.zero = exports.Alt = exports.alt = exports.altW = exports.orElse = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.flatMap = exports.Applicative = exports.Apply = exports.ap = exports.Pointed = exports.of = exports.asUnit = exports.as = exports.Functor = exports.map = exports.getMonoid = exports.getOrd = exports.getEq = exports.getShow = exports.URI = exports.getRight = exports.getLeft = exports.fromPredicate = exports.some = exports.none = void 0;
exports.getFirstMonoid = exports.getApplyMonoid = exports.getApplySemigroup = exports.option = exports.mapNullable = exports.getRefinement = exports.chainFirst = exports.chain = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports["let"] = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toUndefined = exports.toNullable = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.duplicate = exports.tapEither = exports.tap = exports.flatten = exports.apSecond = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = exports.fold = exports.match = exports.foldW = exports.matchW = exports.isNone = exports.isSome = exports.FromEither = exports.fromEither = exports.MonadThrow = exports.throwError = void 0;
exports.getLastMonoid = void 0;
var Applicative_1 = __nccwpck_require__(4766);
var Apply_1 = __nccwpck_require__(205);
var chainable = __importStar(__nccwpck_require__(2372));
var FromEither_1 = __nccwpck_require__(1964);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var _ = __importStar(__nccwpck_require__(1840));
var Predicate_1 = __nccwpck_require__(6382);
var Semigroup_1 = __nccwpck_require__(6339);
var Separated_1 = __nccwpck_require__(5877);
var Witherable_1 = __nccwpck_require__(4384);
var Zero_1 = __nccwpck_require__(9734);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.none = _.none;
/**
 * Constructs a `Some`. Represents an optional value that exists.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.some = _.some;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? (0, exports.some)(a) : exports.none); };
}
exports.fromPredicate = fromPredicate;
/**
 * Returns the `Left` value of an `Either` if possible.
 *
 * @example
 * import { getLeft, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getLeft(right(1)), none)
 * assert.deepStrictEqual(getLeft(left('a')), some('a'))
 *
 * @category constructors
 * @since 2.0.0
 */
var getLeft = function (ma) { return (ma._tag === 'Right' ? exports.none : (0, exports.some)(ma.left)); };
exports.getLeft = getLeft;
/**
 * Returns the `Right` value of an `Either` if possible.
 *
 * @example
 * import { getRight, none, some } from 'fp-ts/Option'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(getRight(right(1)), some(1))
 * assert.deepStrictEqual(getRight(left('a')), none)
 *
 * @category constructors
 * @since 2.0.0
 */
var getRight = function (ma) { return (ma._tag === 'Left' ? exports.none : (0, exports.some)(ma.right)); };
exports.getRight = getRight;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
var _foldMap = function (M) {
    var foldMapM = (0, exports.foldMap)(M);
    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
};
var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
var _traverse = function (F) {
    var traverseF = (0, exports.traverse)(F);
    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
var _filter = function (fa, predicate) { return (0, function_1.pipe)(fa, (0, exports.filter)(predicate)); };
/* istanbul ignore next */
var _filterMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMap)(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return (0, function_1.pipe)(fa, (0, exports.partition)(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMap)(f)); };
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Option';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow = function (S) { return ({
    show: function (ma) { return ((0, exports.isNone)(ma) ? 'none' : "some(".concat(S.show(ma.value), ")")); }
}); };
exports.getShow = getShow;
/**
 * @example
 * import { none, some, getEq } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals(none, none), true)
 * assert.strictEqual(E.equals(none, some(1)), false)
 * assert.strictEqual(E.equals(some(1), none), false)
 * assert.strictEqual(E.equals(some(1), some(2)), false)
 * assert.strictEqual(E.equals(some(1), some(1)), true)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq = function (E) { return ({
    equals: function (x, y) { return x === y || ((0, exports.isNone)(x) ? (0, exports.isNone)(y) : (0, exports.isNone)(y) ? false : E.equals(x.value, y.value)); }
}); };
exports.getEq = getEq;
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/Option'
 * import * as N from 'fp-ts/number'
 *
 * const O = getOrd(N.Ord)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @category instances
 * @since 2.0.0
 */
var getOrd = function (O) { return ({
    equals: (0, exports.getEq)(O).equals,
    compare: function (x, y) { return (x === y ? 0 : (0, exports.isSome)(x) ? ((0, exports.isSome)(y) ? O.compare(x.value, y.value) : 1) : -1); }
}); };
exports.getOrd = getOrd;
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(b) | some(b)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/Option'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const M = getMonoid(SemigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid = function (S) { return ({
    concat: function (x, y) { return ((0, exports.isNone)(x) ? y : (0, exports.isNone)(y) ? x : (0, exports.some)(S.concat(x.value, y.value))); },
    empty: exports.none
}); };
exports.getMonoid = getMonoid;
/**
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) {
    return (0, exports.isNone)(fa) ? exports.none : (0, exports.some)(f(fa.value));
}; };
exports.map = map;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Some` value of this `Option` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Some` value of this `Option` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category constructors
 * @since 2.7.0
 */
exports.of = exports.some;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) {
    return (0, exports.isNone)(fab) ? exports.none : (0, exports.isNone)(fa) ? exports.none : (0, exports.some)(fab.value(fa.value));
}; };
exports.ap = ap;
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) { return ((0, exports.isNone)(ma) ? exports.none : f(ma.value)); });
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap
};
/**
 * @category folding
 * @since 2.0.0
 */
var reduce = function (b, f) { return function (fa) {
    return (0, exports.isNone)(fa) ? b : f(b, fa.value);
}; };
exports.reduce = reduce;
/**
 * @category folding
 * @since 2.0.0
 */
var foldMap = function (M) { return function (f) { return function (fa) {
    return (0, exports.isNone)(fa) ? M.empty : f(fa.value);
}; }; };
exports.foldMap = foldMap;
/**
 * @category folding
 * @since 2.0.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return (0, exports.isNone)(fa) ? b : f(fa.value, b);
}; };
exports.reduceRight = reduceRight;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * Returns the provided `Option` `that` if `self` is `None`, otherwise returns `self`.
 *
 * @param self - The first `Option` to be checked.
 * @param that - The `Option` to return if `self` is `None`.
 *
 * @example
 * import * as O from "fp-ts/Option"
 *
 * assert.deepStrictEqual(O.orElse(O.none, () => O.none), O.none)
 * assert.deepStrictEqual(O.orElse(O.some(1), () => O.none), O.some(1))
 * assert.deepStrictEqual(O.orElse(O.none, () => O.some('b')), O.some('b'))
 * assert.deepStrictEqual(O.orElse(O.some(1), () => O.some('b')), O.some(1))
 *
 * @category error handling
 * @since 2.16.0
 */
exports.orElse = (0, function_1.dual)(2, function (self, that) { return ((0, exports.isNone)(self) ? that() : self); });
/**
 * Alias of `orElse`.
 *
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category legacy
 * @since 2.9.0
 */
exports.altW = exports.orElse;
/**
 * Alias of `orElse`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.alt = exports.orElse;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @since 2.7.0
 */
var zero = function () { return exports.none; };
exports.zero = zero;
/**
 * @category instances
 * @since 2.11.0
 */
exports.Zero = {
    URI: exports.URI,
    zero: exports.zero
};
/**
 * @category do notation
 * @since 2.11.0
 */
exports.guard = (0, Zero_1.guard)(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alternative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    alt: _alt,
    zero: exports.zero
};
/**
 * @since 2.0.0
 */
var extend = function (f) { return function (wa) {
    return (0, exports.isNone)(wa) ? exports.none : (0, exports.some)(f(wa));
}; };
exports.extend = extend;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Extend = {
    URI: exports.URI,
    map: _map,
    extend: _extend
};
/**
 * @category filtering
 * @since 2.0.0
 */
exports.compact = (0, exports.flatMap)(function_1.identity);
var defaultSeparated = /*#__PURE__*/ (0, Separated_1.separated)(exports.none, exports.none);
/**
 * @category filtering
 * @since 2.0.0
 */
var separate = function (ma) {
    return (0, exports.isNone)(ma) ? defaultSeparated : (0, Separated_1.separated)((0, exports.getLeft)(ma.value), (0, exports.getRight)(ma.value));
};
exports.separate = separate;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Compactable = {
    URI: exports.URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category filtering
 * @since 2.0.0
 */
var filter = function (predicate) {
    return function (fa) {
        return (0, exports.isNone)(fa) ? exports.none : predicate(fa.value) ? fa : exports.none;
    };
};
exports.filter = filter;
/**
 * @category filtering
 * @since 2.0.0
 */
var filterMap = function (f) { return function (fa) {
    return (0, exports.isNone)(fa) ? exports.none : f(fa.value);
}; };
exports.filterMap = filterMap;
/**
 * @category filtering
 * @since 2.0.0
 */
var partition = function (predicate) {
    return function (fa) {
        return (0, Separated_1.separated)(_filter(fa, (0, Predicate_1.not)(predicate)), _filter(fa, predicate));
    };
};
exports.partition = partition;
/**
 * @category filtering
 * @since 2.0.0
 */
var partitionMap = function (f) { return (0, function_1.flow)((0, exports.map)(f), exports.separate); };
exports.partitionMap = partitionMap;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Filterable = {
    URI: exports.URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category traversing
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) {
        return function (ta) {
            return (0, exports.isNone)(ta) ? F.of(exports.none) : F.map(f(ta.value), exports.some);
        };
    };
};
exports.traverse = traverse;
/**
 * @category traversing
 * @since 2.6.3
 */
var sequence = function (F) {
    return function (ta) {
        return (0, exports.isNone)(ta) ? F.of(exports.none) : F.map(ta.value, exports.some);
    };
};
exports.sequence = sequence;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
var _wither = /*#__PURE__*/ (0, Witherable_1.witherDefault)(exports.Traversable, exports.Compactable);
var _wilt = /*#__PURE__*/ (0, Witherable_1.wiltDefault)(exports.Traversable, exports.Compactable);
/**
 * @category filtering
 * @since 2.6.5
 */
var wither = function (F) {
    var _witherF = _wither(F);
    return function (f) { return function (fa) { return _witherF(fa, f); }; };
};
exports.wither = wither;
/**
 * @category filtering
 * @since 2.6.5
 */
var wilt = function (F) {
    var _wiltF = _wilt(F);
    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
};
exports.wilt = wilt;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Witherable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt
};
/**
 * @since 2.7.0
 */
var throwError = function () { return exports.none; };
exports.throwError = throwError;
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: exports.flatMap,
    throwError: exports.throwError
};
/**
 * Transforms an `Either` to an `Option` discarding the error.
 *
 * Alias of [getRight](#getright)
 *
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = exports.getRight;
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from 'fp-ts/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category refinements
 * @since 2.0.0
 */
exports.isSome = _.isSome;
/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from 'fp-ts/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 2.0.0
 */
var isNone = function (fa) { return fa._tag === 'None'; };
exports.isNone = isNone;
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
var matchW = function (onNone, onSome) {
    return function (ma) {
        return (0, exports.isNone)(ma) ? onNone() : onSome(ma.value);
    };
};
exports.matchW = matchW;
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchW;
/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = exports.matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.fold = exports.match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
var getOrElseW = function (onNone) {
    return function (ma) {
        return (0, exports.isNone)(ma) ? onNone() : ma.value;
    };
};
exports.getOrElseW = getOrElseW;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElse = exports.getOrElseW;
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = exports.compact;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
exports.tap = (0, function_1.dual)(2, chainable.tap(exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 * import * as E from 'fp-ts/Either'
 *
 * const compute = (value: number) => pipe(
 *   O.of(value),
 *   O.tapEither((value) => value > 0 ? E.right('ok') : E.left('error')),
 * )
 *
 * assert.deepStrictEqual(compute(1), O.of(1))
 * assert.deepStrictEqual(compute(-42), O.none)
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapEither = (0, function_1.dual)(2, (0, FromEither_1.tapEither)(exports.FromEither, exports.Chain));
/**
 * @since 2.0.0
 */
exports.duplicate = (0, exports.extend)(function_1.identity);
/**
 * @category lifting
 * @since 2.11.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
/**
 * @category sequencing
 * @since 2.11.0
 */
exports.chainEitherK = 
/*#__PURE__*/ (0, FromEither_1.chainEitherK)(exports.FromEither, exports.Chain);
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherK = exports.tapEither;
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
var fromNullable = function (a) { return (a == null ? exports.none : (0, exports.some)(a)); };
exports.fromNullable = fromNullable;
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f) {
    try {
        return (0, exports.some)(f());
    }
    catch (e) {
        return exports.none;
    }
};
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `Option`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.tryCatch)(function () { return f.apply(void 0, a); });
    };
};
exports.tryCatchK = tryCatchK;
/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { fromNullableK, none, some } from 'fp-ts/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = fromNullableK(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category lifting
 * @since 2.9.0
 */
var fromNullableK = function (f) { return (0, function_1.flow)(f, exports.fromNullable); };
exports.fromNullableK = fromNullableK;
/**
 * This is `chain` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, chainNullableK } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Employee {
 *   readonly company?: {
 *     readonly address?: {
 *       readonly street?: {
 *         readonly name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     chainNullableK(company => company.address),
 *     chainNullableK(address => address.street),
 *     chainNullableK(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category sequencing
 * @since 2.9.0
 */
var chainNullableK = function (f) {
    return function (ma) {
        return (0, exports.isNone)(ma) ? exports.none : (0, exports.fromNullable)(f(ma.value));
    };
};
exports.chainNullableK = chainNullableK;
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNullable } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNullable
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNullable
 *   ),
 *   null
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.toNullable = (0, exports.match)(function_1.constNull, function_1.identity);
/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
exports.toUndefined = (0, exports.match)(function_1.constUndefined, function_1.identity);
function elem(E) {
    return function (a, ma) {
        if (ma === undefined) {
            var elemE_1 = elem(E);
            return function (ma) { return elemE_1(a, ma); };
        }
        return (0, exports.isNone)(ma) ? false : E.equals(a, ma.value);
    };
}
exports.elem = elem;
/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 2.0.0
 */
var exists = function (predicate) {
    return function (ma) {
        return (0, exports.isNone)(ma) ? false : predicate(ma.value);
    };
};
exports.exists = exists;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports["let"] = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.Apply);
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        var o = f(0, _.head(as));
        if ((0, exports.isNone)(o)) {
            return exports.none;
        }
        var out = [o.value];
        for (var i = 1; i < as.length; i++) {
            var o_1 = f(i, as[i]);
            if ((0, exports.isNone)(o_1)) {
                return exports.none;
            }
            out.push(o_1.value);
        }
        return (0, exports.some)(out);
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chainFirst = exports.tap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `Refinement` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function getRefinement(getOption) {
    return function (a) { return (0, exports.isSome)(getOption(a)); };
}
exports.getRefinement = getRefinement;
/**
 * Use [`chainNullableK`](#chainnullablek) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.mapNullable = exports.chainNullableK;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `O.Functor` instead of `O.option`
 * (where `O` is from `import O from 'fp-ts/Option'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.option = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: exports.flatMap,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence,
    zero: exports.zero,
    alt: _alt,
    extend: _extend,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    wither: _wither,
    wilt: _wilt,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = (0, Apply_1.getApplySemigroup)(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = (0, Applicative_1.getApplicativeMonoid)(exports.Applicative);
/**
 * Use
 *
 * ```ts
 * import { first } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(first())
 * ```
 *
 * instead.
 *
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getFirstMonoid = function () { return (0, exports.getMonoid)((0, Semigroup_1.first)()); };
exports.getFirstMonoid = getFirstMonoid;
/**
 * Use
 *
 * ```ts
 * import { last } from 'fp-ts/Semigroup'
 * import { getMonoid } from 'fp-ts/Option'
 *
 * getMonoid(last())
 * ```
 *
 * instead.
 *
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(b) | some(b)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(2)), some(2))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getLastMonoid = function () { return (0, exports.getMonoid)((0, Semigroup_1.last)()); };
exports.getLastMonoid = getLastMonoid;


/***/ }),

/***/ 6685:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ordDate = exports.ordNumber = exports.ordString = exports.ordBoolean = exports.ord = exports.getDualOrd = exports.getTupleOrd = exports.between = exports.clamp = exports.max = exports.min = exports.geq = exports.leq = exports.gt = exports.lt = exports.equals = exports.trivial = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.URI = exports.contramap = exports.reverse = exports.tuple = exports.fromCompare = exports.equalsDefault = void 0;
var Eq_1 = __nccwpck_require__(6964);
var function_1 = __nccwpck_require__(6985);
// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
var equalsDefault = function (compare) {
    return function (first, second) {
        return first === second || compare(first, second) === 0;
    };
};
exports.equalsDefault = equalsDefault;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromCompare = function (compare) { return ({
    equals: (0, exports.equalsDefault)(compare),
    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
}); };
exports.fromCompare = fromCompare;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Ord'
 * import * as B from 'fp-ts/boolean'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 *
 * const O = tuple(S.Ord, N.Ord, B.Ord)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @since 2.10.0
 */
var tuple = function () {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    return (0, exports.fromCompare)(function (first, second) {
        var i = 0;
        for (; i < ords.length - 1; i++) {
            var r = ords[i].compare(first[i], second[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(first[i], second[i]);
    });
};
exports.tuple = tuple;
/**
 * @since 2.10.0
 */
var reverse = function (O) { return (0, exports.fromCompare)(function (first, second) { return O.compare(second, first); }); };
exports.reverse = reverse;
/* istanbul ignore next */
var contramap_ = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.contramap)(f)); };
/**
 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Ord<User>`.
 *
 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
 * for ordering (meaning we have an `Ord<X>`)
 *
 * For example, given the following `User` type, there are lots of possible choices for `X`,
 * but let's say we want to sort a list of users by `lastName`.
 *
 * If we have a way of comparing `lastName`s for ordering (`ordLastName: Ord<string>`) and we know how to go from `User -> string`,
 * using `contramap` we can do this
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { contramap, Ord } from 'fp-ts/Ord'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * interface User {
 *   readonly firstName: string
 *   readonly lastName: string
 * }
 *
 * const ordLastName: Ord<string> = S.Ord
 *
 * const ordByLastName: Ord<User> = pipe(
 *   ordLastName,
 *   contramap((user) => user.lastName)
 * )
 *
 * assert.deepStrictEqual(
 *   RA.sort(ordByLastName)([
 *     { firstName: 'a', lastName: 'd' },
 *     { firstName: 'c', lastName: 'b' }
 *   ]),
 *   [
 *     { firstName: 'c', lastName: 'b' },
 *     { firstName: 'a', lastName: 'd' }
 *   ]
 * )
 *
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return (0, exports.fromCompare)(function (first, second) { return fa.compare(f(first), f(second)); });
}; };
exports.contramap = contramap;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Ord';
/**
 * A typical use case for the `Semigroup` instance of `Ord` is merging two or more orderings.
 *
 * For example the following snippet builds an `Ord` for a type `User` which
 * sorts by `created` date descending, and **then** `lastName`
 *
 * @example
 * import * as D from 'fp-ts/Date'
 * import { pipe } from 'fp-ts/function'
 * import { contramap, getSemigroup, Ord, reverse } from 'fp-ts/Ord'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * interface User {
 *   readonly id: string
 *   readonly lastName: string
 *   readonly created: Date
 * }
 *
 * const ordByLastName: Ord<User> = pipe(
 *   S.Ord,
 *   contramap((user) => user.lastName)
 * )
 *
 * const ordByCreated: Ord<User> = pipe(
 *   D.Ord,
 *   contramap((user) => user.created)
 * )
 *
 * const ordUserByCreatedDescThenLastName = getSemigroup<User>().concat(
 *   reverse(ordByCreated),
 *   ordByLastName
 * )
 *
 * assert.deepStrictEqual(
 *   RA.sort(ordUserByCreatedDescThenLastName)([
 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) },
 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) }
 *   ]),
 *   [
 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) },
 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) }
 *   ]
 * )
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) {
        return (0, exports.fromCompare)(function (a, b) {
            var ox = first.compare(a, b);
            return ox !== 0 ? ox : second.compare(a, b);
        });
    }
}); };
exports.getSemigroup = getSemigroup;
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as B from 'fp-ts/boolean'
 * import { pipe } from 'fp-ts/function'
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface User {
 *   readonly id: number
 *   readonly name: string
 *   readonly age: number
 *   readonly rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   S.Ord,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   N.Ord,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   B.Ord,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
var getMonoid = function () { return ({
    concat: (0, exports.getSemigroup)().concat,
    empty: (0, exports.fromCompare)(function () { return 0; })
}); };
exports.getMonoid = getMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.trivial = {
    equals: function_1.constTrue,
    compare: /*#__PURE__*/ (0, function_1.constant)(0)
};
/**
 * @since 2.11.0
 */
var equals = function (O) {
    return function (second) {
        return function (first) {
            return first === second || O.compare(first, second) === 0;
        };
    };
};
exports.equals = equals;
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
var lt = function (O) {
    return function (first, second) {
        return O.compare(first, second) === -1;
    };
};
exports.lt = lt;
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
var gt = function (O) {
    return function (first, second) {
        return O.compare(first, second) === 1;
    };
};
exports.gt = gt;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
var leq = function (O) {
    return function (first, second) {
        return O.compare(first, second) !== 1;
    };
};
exports.leq = leq;
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
var geq = function (O) {
    return function (first, second) {
        return O.compare(first, second) !== -1;
    };
};
exports.geq = geq;
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var min = function (O) {
    return function (first, second) {
        return first === second || O.compare(first, second) < 1 ? first : second;
    };
};
exports.min = min;
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var max = function (O) {
    return function (first, second) {
        return first === second || O.compare(first, second) > -1 ? first : second;
    };
};
exports.max = max;
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
var clamp = function (O) {
    var minO = (0, exports.min)(O);
    var maxO = (0, exports.max)(O);
    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
};
exports.clamp = clamp;
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
var between = function (O) {
    var ltO = (0, exports.lt)(O);
    var gtO = (0, exports.gt)(O);
    return function (low, hi) { return function (a) { return ltO(a, low) || gtO(a, hi) ? false : true; }; };
};
exports.between = between;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleOrd = exports.tuple;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getDualOrd = exports.reverse;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ord = exports.Contravariant;
// default compare for primitive types
function compare(first, second) {
    return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
    equals: Eq_1.eqStrict.equals,
    compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#ord) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.ordDate = (0, function_1.pipe)(exports.ordNumber, 
/*#__PURE__*/
(0, exports.contramap)(function (date) { return date.valueOf(); }));


/***/ }),

/***/ 6382:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.and = exports.or = exports.not = exports.Contravariant = exports.getMonoidAll = exports.getSemigroupAll = exports.getMonoidAny = exports.getSemigroupAny = exports.URI = exports.contramap = void 0;
var function_1 = __nccwpck_require__(6985);
var contramap_ = function (predicate, f) { return (0, function_1.pipe)(predicate, (0, exports.contramap)(f)); };
/**
 * @since 2.11.0
 */
var contramap = function (f) {
    return function (predicate) {
        return (0, function_1.flow)(f, predicate);
    };
};
exports.contramap = contramap;
/**
 * @category type lambdas
 * @since 2.11.0
 */
exports.URI = 'Predicate';
/**
 * @category instances
 * @since 2.11.0
 */
var getSemigroupAny = function () { return ({
    concat: function (first, second) { return (0, function_1.pipe)(first, (0, exports.or)(second)); }
}); };
exports.getSemigroupAny = getSemigroupAny;
/**
 * @category instances
 * @since 2.11.0
 */
var getMonoidAny = function () { return ({
    concat: (0, exports.getSemigroupAny)().concat,
    empty: function_1.constFalse
}); };
exports.getMonoidAny = getMonoidAny;
/**
 * @category instances
 * @since 2.11.0
 */
var getSemigroupAll = function () { return ({
    concat: function (first, second) { return (0, function_1.pipe)(first, (0, exports.and)(second)); }
}); };
exports.getSemigroupAll = getSemigroupAll;
/**
 * @category instances
 * @since 2.11.0
 */
var getMonoidAll = function () { return ({
    concat: (0, exports.getSemigroupAll)().concat,
    empty: function_1.constTrue
}); };
exports.getMonoidAll = getMonoidAll;
/**
 * @category instances
 * @since 2.11.0
 */
exports.Contravariant = {
    URI: exports.URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var not = function (predicate) {
    return function (a) {
        return !predicate(a);
    };
};
exports.not = not;
/**
 * @since 2.11.0
 */
var or = function (second) {
    return function (first) {
        return function (a) {
            return first(a) || second(a);
        };
    };
};
exports.or = or;
/**
 * @since 2.11.0
 */
var and = function (second) {
    return function (first) {
        return function (a) {
            return first(a) && second(a);
        };
    };
};
exports.and = and;


/***/ }),

/***/ 6339:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.semigroupProduct = exports.semigroupSum = exports.semigroupString = exports.getFunctionSemigroup = exports.semigroupAny = exports.semigroupAll = exports.fold = exports.getIntercalateSemigroup = exports.getMeetSemigroup = exports.getJoinSemigroup = exports.getDualSemigroup = exports.getStructSemigroup = exports.getTupleSemigroup = exports.getFirstSemigroup = exports.getLastSemigroup = exports.getObjectSemigroup = exports.semigroupVoid = exports.concatAll = exports.last = exports.first = exports.intercalate = exports.tuple = exports.struct = exports.reverse = exports.constant = exports.max = exports.min = void 0;
/**
 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
 *
 * ```ts
 * interface Semigroup<A> {
 *   readonly concat: (x: A, y: A) => A
 * }
 * ```
 *
 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
 *
 * ```ts
 * concat(x, concat(y, z)) = concat(concat(x, y), z)
 * ```
 *
 * A common example of a semigroup is the type `string` with the operation `+`.
 *
 * ```ts
 * import { Semigroup } from 'fp-ts/Semigroup'
 *
 * const semigroupString: Semigroup<string> = {
 *   concat: (x, y) => x + y
 * }
 *
 * const x = 'x'
 * const y = 'y'
 * const z = 'z'
 *
 * semigroupString.concat(x, y) // 'xy'
 *
 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
 *
 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
 * ```
 *
 * *Adapted from https://typelevel.org/cats*
 *
 * @since 2.0.0
 */
var function_1 = __nccwpck_require__(6985);
var _ = __importStar(__nccwpck_require__(1840));
var M = __importStar(__nccwpck_require__(179));
var Or = __importStar(__nccwpck_require__(6685));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a semigroup where `concat` will return the minimum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.min(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min = function (O) { return ({
    concat: Or.min(O)
}); };
exports.min = min;
/**
 * Get a semigroup where `concat` will return the maximum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.max(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
var max = function (O) { return ({
    concat: Or.max(O)
}); };
exports.max = max;
/**
 * @category constructors
 * @since 2.10.0
 */
var constant = function (a) { return ({
    concat: function () { return a; }
}); };
exports.constant = constant;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Semigroup).concat('a', 'b'), 'ba')
 *
 * @since 2.10.0
 */
exports.reverse = M.reverse;
/**
 * Given a struct of semigroups returns a semigroup for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const S = struct<Point>({
 *   x: N.SemigroupSum,
 *   y: N.SemigroupSum
 * })
 *
 * assert.deepStrictEqual(S.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @since 2.10.0
 */
var struct = function (semigroups) { return ({
    concat: function (first, second) {
        var r = {};
        for (var k in semigroups) {
            if (_.has.call(semigroups, k)) {
                r[k] = semigroups[k].concat(first[k], second[k]);
            }
        }
        return r;
    }
}); };
exports.struct = struct;
/**
 * Given a tuple of semigroups returns a semigroup for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Semigroup'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const S1 = tuple(S.Semigroup, N.SemigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = tuple(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.10.0
 */
var tuple = function () {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return ({
        concat: function (first, second) { return semigroups.map(function (s, i) { return s.concat(first[i], second[i]); }); }
    });
};
exports.tuple = tuple;
/**
 * Between each pair of elements insert `middle`.
 *
 * @example
 * import { intercalate } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * const S1 = pipe(S.Semigroup, intercalate(' + '))
 *
 * assert.strictEqual(S1.concat('a', 'b'), 'a + b')
 *
 * @since 2.10.0
 */
var intercalate = function (middle) {
    return function (S) { return ({
        concat: function (x, y) { return S.concat(x, S.concat(middle, y)); }
    }); };
};
exports.intercalate = intercalate;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * Always return the first argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.first<number>().concat(1, 2), 1)
 *
 * @category instances
 * @since 2.10.0
 */
var first = function () { return ({ concat: function_1.identity }); };
exports.first = first;
/**
 * Always return the last argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.last<number>().concat(1, 2), 2)
 *
 * @category instances
 * @since 2.10.0
 */
var last = function () { return ({ concat: function (_, y) { return y; } }); };
exports.last = last;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * const sum = concatAll(N.SemigroupSum)(0)
 *
 * assert.deepStrictEqual(sum([1, 2, 3]), 6)
 * assert.deepStrictEqual(sum([]), 0)
 *
 * @since 2.10.0
 */
exports.concatAll = M.concatAll;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use `void` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupVoid = (0, exports.constant)(undefined);
/**
 * Use [`getAssignSemigroup`](./struct.ts.html#getAssignSemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getObjectSemigroup = function () { return ({
    concat: function (first, second) { return Object.assign({}, first, second); }
}); };
exports.getObjectSemigroup = getObjectSemigroup;
/**
 * Use [`last`](#last) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getLastSemigroup = exports.last;
/**
 * Use [`first`](#first) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFirstSemigroup = exports.first;
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getTupleSemigroup = exports.tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getStructSemigroup = exports.struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getDualSemigroup = exports.reverse;
/**
 * Use [`max`](#max) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getJoinSemigroup = exports.max;
/**
 * Use [`min`](#min) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getMeetSemigroup = exports.min;
/**
 * Use [`intercalate`](#intercalate) instead.
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
exports.getIntercalateSemigroup = exports.intercalate;
function fold(S) {
    var concatAllS = (0, exports.concatAll)(S);
    return function (startWith, as) { return (as === undefined ? concatAllS(startWith) : concatAllS(startWith)(as)); };
}
exports.fold = fold;
/**
 * Use [`SemigroupAll`](./boolean.ts.html#SemigroupAll) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Use [`SemigroupAny`](./boolean.ts.html#SemigroupAny) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Use [`getSemigroup`](./function.ts.html#getSemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getFunctionSemigroup = function_1.getSemigroup;
/**
 * Use [`Semigroup`](./string.ts.html#Semigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupSum`](./number.ts.html#SemigroupSum) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupProduct`](./number.ts.html#SemigroupProduct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.semigroupProduct = {
    concat: function (x, y) { return x * y; }
};


/***/ }),

/***/ 5877:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/**
 * ```ts
 * interface Separated<E, A> {
 *    readonly left: E
 *    readonly right: A
 * }
 * ```
 *
 * Represents a result of separating a whole into two parts.
 *
 * @since 2.10.0
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.right = exports.left = exports.flap = exports.Functor = exports.Bifunctor = exports.URI = exports.bimap = exports.mapLeft = exports.map = exports.separated = void 0;
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var separated = function (left, right) { return ({ left: left, right: right }); };
exports.separated = separated;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapLeft)(f)); };
var _bimap = function (fa, g, f) { return (0, function_1.pipe)(fa, (0, exports.bimap)(g, f)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.10.0
 */
var map = function (f) {
    return function (fa) {
        return (0, exports.separated)((0, exports.left)(fa), f((0, exports.right)(fa)));
    };
};
exports.map = map;
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category error handling
 * @since 2.10.0
 */
var mapLeft = function (f) {
    return function (fa) {
        return (0, exports.separated)(f((0, exports.left)(fa)), (0, exports.right)(fa));
    };
};
exports.mapLeft = mapLeft;
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.10.0
 */
var bimap = function (f, g) {
    return function (fa) {
        return (0, exports.separated)(f((0, exports.left)(fa)), g((0, exports.right)(fa)));
    };
};
exports.bimap = bimap;
/**
 * @category type lambdas
 * @since 2.10.0
 */
exports.URI = 'Separated';
/**
 * @category instances
 * @since 2.10.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    mapLeft: _mapLeft,
    bimap: _bimap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
var left = function (s) { return s.left; };
exports.left = left;
/**
 * @since 2.10.0
 */
var right = function (s) { return s.right; };
exports.right = right;


/***/ }),

/***/ 2664:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports["let"] = exports.bindTo = exports.Do = exports.never = exports.FromTask = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.tapIO = exports.tap = exports.flatMapIO = exports.FromIO = exports.MonadTask = exports.fromTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.getRaceMonoid = exports.URI = exports.flatten = exports.flatMap = exports.of = exports.ap = exports.map = exports.delay = exports.fromIO = void 0;
exports.getMonoid = exports.getSemigroup = exports.taskSeq = exports.task = exports.chainFirst = exports.chain = void 0;
/**
 * ```ts
 * interface Task<A> {
 *   (): Promise<A>
 * }
 * ```
 *
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see `TaskEither`.
 *
 * @since 2.0.0
 */
var Applicative_1 = __nccwpck_require__(4766);
var Apply_1 = __nccwpck_require__(205);
var chainable = __importStar(__nccwpck_require__(2372));
var FromIO_1 = __nccwpck_require__(7948);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var _ = __importStar(__nccwpck_require__(1840));
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.0.0
 */
var fromIO = function (ma) { return function () { return Promise.resolve().then(ma); }; };
exports.fromIO = fromIO;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Creates a task that will complete after a time delay
 *
 * @example
 * import { sequenceT } from 'fp-ts/Apply'
 * import * as T from 'fp-ts/Task'
 * import { takeRight } from 'fp-ts/Array'
 *
 * async function test() {
 *   const log: Array<string> = []
 *   const append = (message: string): T.Task<void> =>
 *     T.fromIO(() => {
 *       log.push(message)
 *     })
 *   const fa = append('a')
 *   const fb = T.delay(20)(append('b'))
 *   const fc = T.delay(10)(append('c'))
 *   const fd = append('d')
 *   await sequenceT(T.ApplyPar)(fa, fb, fc, fd)()
 *   assert.deepStrictEqual(takeRight(2)(log), ['c', 'b'])
 * }
 *
 * test()
 *
 * @since 2.0.0
 */
function delay(millis) {
    return function (ma) { return function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                Promise.resolve().then(ma).then(resolve);
            }, millis);
        });
    }; };
}
exports.delay = delay;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _apPar = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
var _apSeq = function (fab, fa) { return (0, exports.flatMap)(fab, function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); }); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
var map = function (f) { return function (fa) { return function () {
    return Promise.resolve().then(fa).then(f);
}; }; };
exports.map = map;
/**
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return function () {
    return Promise.all([Promise.resolve().then(fab), Promise.resolve().then(fa)]).then(function (_a) {
        var f = _a[0], a = _a[1];
        return f(a);
    });
}; }; };
exports.ap = ap;
/**
 * @category constructors
 * @since 2.0.0
 */
var of = function (a) { return function () { return Promise.resolve(a); }; };
exports.of = of;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    return function () {
        return Promise.resolve()
            .then(ma)
            .then(function (a) { return f(a)(); });
    };
});
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = (0, exports.flatMap)(function_1.identity);
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'Task';
/**
 * Monoid returning the first completed task.
 *
 * Note: uses `Promise.race` internally.
 *
 * @example
 * import * as T from 'fp-ts/Task'
 *
 * async function test() {
 *   const S = T.getRaceMonoid<string>()
 *   const fa = T.delay(20)(T.of('a'))
 *   const fb = T.delay(10)(T.of('b'))
 *   assert.deepStrictEqual(await S.concat(fa, fb)(), 'b')
 * }
 *
 * test()
 *
 * @category instances
 * @since 2.0.0
 */
function getRaceMonoid() {
    return {
        concat: function (x, y) { return function () { return Promise.race([Promise.resolve().then(x), Promise.resolve().then(y)]); }; },
        empty: exports.never
    };
}
exports.getRaceMonoid = getRaceMonoid;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the value to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the value to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.ApplyPar);
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    fromIO: exports.fromIO
};
/**
 * @category zone of death
 * @since 2.7.0
 * @deprecated
 */
exports.fromTask = function_1.identity;
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/** @internal */
var _FromIO = {
    fromIO: exports.FromIO.fromIO
};
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapIO = _.flatMapIO(_FromIO, _FlatMap);
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
exports.tap = (0, function_1.dual)(2, chainable.tap(exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as T from 'fp-ts/Task'
 * import * as Console from 'fp-ts/Console'
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effect = pipe(
 *   T.of('fp-ts'),
 *   T.tapIO((value) => Console.log(`Hello, ${value}`)),
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(), 'fp-ts')
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapIO = (0, function_1.dual)(2, (0, FromIO_1.tapIO)(exports.FromIO, exports.Chain));
/**
 * @category lifting
 * @since 2.4.0
 */
exports.fromIOK = 
/*#__PURE__*/ (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainIOK = exports.flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstIOK = exports.tapIO;
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * A `Task` that never completes.
 *
 * @since 2.0.0
 */
var never = function () { return new Promise(function (_) { return undefined; }); };
exports.never = never;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports["let"] = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.ApplyPar);
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function (as) {
        return function () {
            return Promise.all(as.map(function (a, i) { return Promise.resolve().then(function () { return f(i, a)(); }); }));
        };
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return function (as) {
        return function () {
            return _.tail(as).reduce(function (acc, a, i) {
                return acc.then(function (bs) {
                    return Promise.resolve()
                        .then(f(i + 1, a))
                        .then(function (b) {
                        bs.push(b);
                        return bs;
                    });
                });
            }, Promise.resolve()
                .then(f(0, _.head(as)))
                .then(_.singleton));
        };
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndexSeq)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseSeqArray = function (f) {
    return (0, exports.traverseReadonlyArrayWithIndexSeq)(function (_, a) { return f(a); });
};
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/ (0, exports.traverseSeqArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chainFirst = exports.tap;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.task`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.task = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `T.Functor` instead of `T.taskSeq`
 * (where `T` is from `import T from 'fp-ts/Task'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskSeq = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: exports.flatMap,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = (0, Apply_1.getApplySemigroup)(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * Lift a monoid into 'Task', the inner values are concatenated using the provided `Monoid`.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getMonoid = (0, Applicative_1.getApplicativeMonoid)(exports.ApplicativeSeq);


/***/ }),

/***/ 437:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throwError = exports.of = exports.altW = exports.alt = exports.flatten = exports.flattenW = exports.flatMap = exports.apW = exports.ap = exports.mapLeft = exports.mapError = exports.bimap = exports.mapBoth = exports.map = exports.fromIOEitherK = exports.chainTaskOptionK = exports.chainTaskOptionKW = exports.fromTaskOptionK = exports.swap = exports.orLeft = exports.orElseFirstTaskK = exports.orElseFirstIOK = exports.tapError = exports.orElseW = exports.orElse = exports.chainNullableK = exports.fromNullableK = exports.fromNullable = exports.toUnion = exports.tryCatchK = exports.tryCatch = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTaskOption = exports.fromIOEither = exports.fromEither = exports.fromTask = exports.fromIO = exports.leftIO = exports.rightIO = exports.leftTask = exports.rightTask = exports.right = exports.left = void 0;
exports.fromPredicate = exports.chainFirstEitherKW = exports.chainFirstEitherK = exports.chainEitherKW = exports.chainEitherK = exports.flatMapTaskOption = exports.flatMapIOEither = exports.flatMapTask = exports.flatMapIO = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.chainOptionKW = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.Alt = exports.Bifunctor = exports.tapTask = exports.tapIO = exports.tapEither = exports.tap = exports.FromTask = exports.FromIO = exports.FromEither = exports.MonadThrow = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecondW = exports.apSecond = exports.apFirstW = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.asUnit = exports.as = exports.Functor = exports.getFilterable = exports.getCompactable = exports.getAltTaskValidation = exports.getApplicativeTaskValidation = exports.URI = void 0;
exports.getTaskValidation = exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.taskEitherSeq = exports.taskEither = exports.orElseFirstW = exports.orElseFirst = exports.chainFirstW = exports.chainFirst = exports.chainW = exports.chain = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports["let"] = exports.bindTo = exports.Do = exports.bracketW = exports.bracket = exports.taskify = exports.chainIOEitherK = exports.chainIOEitherKW = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = void 0;
var Applicative_1 = __nccwpck_require__(4766);
var Apply_1 = __nccwpck_require__(205);
var chainable = __importStar(__nccwpck_require__(2372));
var Compactable_1 = __nccwpck_require__(729);
var E = __importStar(__nccwpck_require__(7534));
var ET = __importStar(__nccwpck_require__(9803));
var Filterable_1 = __nccwpck_require__(6907);
var FromEither_1 = __nccwpck_require__(1964);
var FromIO_1 = __nccwpck_require__(7948);
var FromTask_1 = __nccwpck_require__(2038);
var function_1 = __nccwpck_require__(6985);
var Functor_1 = __nccwpck_require__(5533);
var _ = __importStar(__nccwpck_require__(1840));
var T = __importStar(__nccwpck_require__(2664));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = ET.left(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = ET.right(T.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightTask = ET.rightF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftTask = ET.leftF(T.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = (0, function_1.flow)(T.fromIO, exports.rightTask);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = (0, function_1.flow)(T.fromIO, exports.leftTask);
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
/**
 * @category conversions
 * @since 2.7.0
 */
exports.fromTask = exports.rightTask;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromEither = T.of;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromIOEither = T.fromIO;
/**
 * @category conversions
 * @since 2.11.0
 */
var fromTaskOption = function (onNone) {
    return T.map(E.fromOption(onNone));
};
exports.fromTaskOption = fromTaskOption;
/**
 * @category pattern matching
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/ ET.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * The `E` suffix (short for **E**ffect) means that the handlers return an effect (`Task`).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchE = ET.matchE(T.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category pattern matching
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category error handling
 * @since 2.0.0
 */
exports.getOrElse = 
/*#__PURE__*/ ET.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * The `W` suffix (short for **W**idening) means that the handler return type will be merged.
 *
 * @category error handling
 * @since 2.6.0
 */
exports.getOrElseW = exports.getOrElse;
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Either` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import { left, right } from 'fp-ts/Either'
 * import { tryCatch } from 'fp-ts/TaskEither'
 *
 * tryCatch(() => Promise.resolve(1), String)().then(result => {
 *   assert.deepStrictEqual(result, right(1))
 * })
 * tryCatch(() => Promise.reject('error'), String)().then(result => {
 *   assert.deepStrictEqual(result, left('error'))
 * })
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onRejected) {
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var reason_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, f().then(_.right)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    reason_1 = _a.sent();
                    return [2 /*return*/, _.left(onRejected(reason_1))];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
exports.tryCatch = tryCatch;
/**
 * Converts a function returning a `Promise` to one returning a `TaskEither`.
 *
 * @category interop
 * @since 2.5.0
 */
var tryCatchK = function (f, onRejected) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return (0, exports.tryCatch)(function () { return f.apply(void 0, a); }, onRejected);
    };
};
exports.tryCatchK = tryCatchK;
/**
 * @category conversions
 * @since 2.10.0
 */
exports.toUnion = ET.toUnion(T.Functor);
/**
 * @category conversions
 * @since 2.12.0
 */
exports.fromNullable = ET.fromNullable(T.Pointed);
/**
 * Use `liftNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.fromNullableK = ET.fromNullableK(T.Pointed);
/**
 * Use `flatMapNullable`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainNullableK = 
/*#__PURE__*/ ET.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Returns `ma` if is a `Right` or the value returned by `onLeft` otherwise.
 *
 * See also [alt](#alt).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   const errorHandler = TE.orElse((error: string) => TE.right(`recovering from ${error}...`))
 *   assert.deepStrictEqual(await pipe(TE.right('ok'), errorHandler)(), E.right('ok'))
 *   assert.deepStrictEqual(await pipe(TE.left('ko'), errorHandler)(), E.right('recovering from ko...'))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/ ET.orElse(T.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * The `W` suffix (short for **W**idening) means that the return types will be merged.
 *
 * @category error handling
 * @since 2.10.0
 */
exports.orElseW = exports.orElse;
/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category error handling
 * @since 2.15.0
 */
exports.tapError = (0, function_1.dual)(2, ET.tapError(T.Monad));
/**
 * @category error handling
 * @since 2.12.0
 */
var orElseFirstIOK = function (onLeft) { return (0, exports.tapError)((0, exports.fromIOK)(onLeft)); };
exports.orElseFirstIOK = orElseFirstIOK;
/**
 * @category error handling
 * @since 2.12.0
 */
var orElseFirstTaskK = function (onLeft) { return (0, exports.tapError)((0, exports.fromTaskK)(onLeft)); };
exports.orElseFirstTaskK = orElseFirstTaskK;
/**
 * @category error handling
 * @since 2.11.0
 */
exports.orLeft = 
/*#__PURE__*/ ET.orLeft(T.Monad);
/**
 * @since 2.0.0
 */
exports.swap = ET.swap(T.Functor);
/**
 * @category lifting
 * @since 2.11.0
 */
var fromTaskOptionK = function (onNone) {
    var from = (0, exports.fromTaskOption)(onNone);
    return function (f) { return (0, function_1.flow)(f, from); };
};
exports.fromTaskOptionK = fromTaskOptionK;
/**
 * Use `flatMapTaskOption`.
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.3
 */
var chainTaskOptionKW = function (onNone) {
    return function (f) {
        return function (ma) {
            return (0, exports.flatMap)(ma, (0, exports.fromTaskOptionK)(onNone)(f));
        };
    };
};
exports.chainTaskOptionKW = chainTaskOptionKW;
/**
 * Use `flatMapTaskOption`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.chainTaskOptionK = exports.chainTaskOptionKW;
/**
 * @category lifting
 * @since 2.4.0
 */
var fromIOEitherK = function (f) { return (0, function_1.flow)(f, exports.fromIOEither); };
exports.fromIOEitherK = fromIOEitherK;
var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
var _apPar = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
var _apSeq = function (fab, fa) { return (0, exports.flatMap)(fab, function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); }); };
/* istanbul ignore next */
var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.map = ET.map(T.Functor);
/**
 * Returns a `TaskEither` whose failure and success channels have been mapped by the specified pair of functions, `f` and `g`.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 * const g = (n: number) => n * 2
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.right(1), f, g)(), Either.right(2))
 *   assert.deepStrictEqual(await TaskEither.mapBoth(TaskEither.left('err'), f, g)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapBoth = (0, function_1.dual)(3, ET.mapBoth(T.Functor));
/**
 * Alias of `mapBoth`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.bimap = exports.mapBoth;
/**
 * Returns a `TaskEither` with its error channel mapped using the specified function.
 *
 * @example
 * import * as TaskEither from 'fp-ts/TaskEither'
 * import * as Either from 'fp-ts/Either'
 *
 * const f = (s: string) => new Error(s)
 *
 * async function test() {
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.right(1), f)(), Either.right(1))
 *   assert.deepStrictEqual(await TaskEither.mapError(TaskEither.left('err'), f)(), Either.left(new Error('err')))
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.16.0
 */
exports.mapError = (0, function_1.dual)(2, ET.mapError(T.Functor));
/**
 * Alias of `mapError`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.mapLeft = exports.mapError;
/**
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/ ET.ap(T.ApplyPar);
/**
 * Less strict version of [`ap`](#ap).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category sequencing
 * @since 2.14.0
 */
exports.flatMap = (0, function_1.dual)(2, ET.flatMap(T.Monad));
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category sequencing
 * @since 2.11.0
 */
exports.flattenW = 
/*#__PURE__*/ (0, exports.flatMap)(function_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = exports.flattenW;
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `TaskEither` returns `fa` if is a `Right` or the value returned by `that` otherwise.
 *
 * See also [orElse](#orelse).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.right(1),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(1)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.right(2))
 *     )(),
 *     E.right(2)
 *   )
 *   assert.deepStrictEqual(
 *     await pipe(
 *       TE.left('a'),
 *       TE.alt(() => TE.left('b'))
 *     )(),
 *     E.left('b')
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.0.0
 */
exports.alt = 
/*#__PURE__*/ ET.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * The `W` suffix (short for **W**idening) means that the error and the return types will be merged.
 *
 * @category error handling
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.of = exports.right;
/**
 * @since 2.7.0
 */
exports.throwError = exports.left;
/**
 * @category type lambdas
 * @since 2.0.0
 */
exports.URI = 'TaskEither';
/**
 * The default [`ApplicativePar`](#applicativepar) instance returns the first error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/Semigroup'
 * import * as string from 'fp-ts/string'
 * import * as T from 'fp-ts/Task'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * interface User {
 *   readonly id: string
 *   readonly name: string
 * }
 *
 * const remoteDatabase: ReadonlyArray<User> = [
 *   { id: 'id1', name: 'John' },
 *   { id: 'id2', name: 'Mary' },
 *   { id: 'id3', name: 'Joey' }
 * ]
 *
 * const fetchUser = (id: string): TE.TaskEither<string, User> =>
 *   pipe(
 *     remoteDatabase,
 *     RA.findFirst((user) => user.id === id),
 *     TE.fromOption(() => `${id} not found`)
 *   )
 *
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(TE.ApplicativePar)(fetchUser))(),
 *     E.left('id4 not found') // <= first error
 *   )
 *
 *   const Applicative = TE.getApplicativeTaskValidation(
 *     T.ApplyPar,
 *     pipe(string.Semigroup, S.intercalate(', '))
 *   )
 *
 *   assert.deepStrictEqual(
 *     await pipe(['id4', 'id5'], RA.traverse(Applicative)(fetchUser))(),
 *     E.left('id4 not found, id5 not found') // <= all errors
 *   )
 * }
 *
 * test()
 *
 * @category error handling
 * @since 2.7.0
 */
function getApplicativeTaskValidation(A, S) {
    var ap = (0, Apply_1.ap)(A, E.getApplicativeValidation(S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return (0, function_1.pipe)(fab, ap(fa)); },
        of: exports.of
    };
}
exports.getApplicativeTaskValidation = getApplicativeTaskValidation;
/**
 * The default [`Alt`](#alt) instance returns the last error, if you want to
 * get all errors you need to provide a way to concatenate them via a `Semigroup`.
 *
 * See [`getAltValidation`](./Either.ts.html#getaltvalidation).
 *
 * @category error handling
 * @since 2.7.0
 */
function getAltTaskValidation(S) {
    var alt = ET.altValidation(T.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return (0, function_1.pipe)(fa, alt(that)); }
    };
}
exports.getAltTaskValidation = getAltTaskValidation;
/**
 * @category filtering
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: (0, Compactable_1.compact)(T.Functor, C),
        separate: (0, Compactable_1.separate)(T.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category filtering
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = (0, exports.getCompactable)(M);
    var filter = (0, Filterable_1.filter)(T.Functor, F);
    var filterMap = (0, Filterable_1.filterMap)(T.Functor, F);
    var partition = (0, Filterable_1.partition)(T.Functor, F);
    var partitionMap = (0, Filterable_1.partitionMap)(T.Functor, F);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return (0, function_1.pipe)(fa, filter(predicate)); },
        filterMap: function (fa, f) { return (0, function_1.pipe)(fa, filterMap(f)); },
        partition: function (fa, predicate) { return (0, function_1.pipe)(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return (0, function_1.pipe)(fa, partitionMap(f)); }
    };
}
exports.getFilterable = getFilterable;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Maps the `Right` value of this `TaskEither` to the specified constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.as = (0, function_1.dual)(2, (0, Functor_1.as)(exports.Functor));
/**
 * Maps the `Right` value of this `TaskEither` to the void constant value.
 *
 * @category mapping
 * @since 2.16.0
 */
exports.asUnit = (0, Functor_1.asUnit)(exports.Functor);
/**
 * @category mapping
 * @since 2.10.0
 */
exports.flap = (0, Functor_1.flap)(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * @since 2.0.0
 */
exports.apFirst = (0, Apply_1.apFirst)(exports.ApplyPar);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apFirstW = exports.apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * @since 2.0.0
 */
exports.apSecond = (0, Apply_1.apSecond)(exports.ApplyPar);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
exports.apSecondW = exports.apSecond;
/**
 * Runs computations in parallel.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    of: exports.of
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq
};
/**
 * Runs computations sequentially.
 *
 * @category instances
 * @since 2.7.0
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _apPar,
    chain: exports.flatMap,
    of: exports.of,
    throwError: exports.throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: exports.URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @category combinators
 * @since 2.15.0
 */
exports.tap = (0, function_1.dual)(2, chainable.tap(exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * const checkString = (value: string) => pipe(
 *   TE.of(value),
 *   TE.tapEither(() => value.length > 0 ? E.right('ok') : E.left('error'))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await checkString('')(), E.left('error'))
 *   assert.deepStrictEqual(await checkString('fp-ts')(), E.right('fp-ts'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapEither = (0, function_1.dual)(2, (0, FromEither_1.tapEither)(exports.FromEither, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as E from 'fp-ts/Either'
 * import * as Console from 'fp-ts/Console'
 *
 *
 * // Will produce `Hello, fp-ts` to the stdout
 * const effectA = TE.tapIO(
 *   TE.of(1),
 *   (value) => Console.log(`Hello, ${value}`)
 * )
 *
 * // No output to the stdout
 * const effectB = pipe(
 *   TE.left('error'),
 *   TE.tapIO((value) => Console.log(`Hello, ${value}`))
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effectA(), E.of(1))
 *   assert.deepStrictEqual(await effectB(), E.left('error'))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapIO = (0, function_1.dual)(2, (0, FromIO_1.tapIO)(exports.FromIO, exports.Chain));
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * @example
 * import * as TE from 'fp-ts/TaskEither'
 * import * as T from 'fp-ts/Task'
 * import * as E from 'fp-ts/Either'
 *
 *
 * const effect = TE.tapIO(
 *   TE.of(1),
 *   (value) => T.of(value + 1)
 * )
 *
 * async function test() {
 *   assert.deepStrictEqual(await effect(), E.of(1))
 * }
 *
 * test()
 *
 * @category combinators
 * @since 2.16.0
 */
exports.tapTask = (0, function_1.dual)(2, (0, FromTask_1.tapTask)(exports.FromTask, exports.Chain));
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/ (0, FromEither_1.fromOption)(exports.FromEither);
/**
 * Use `liftOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/ (0, FromEither_1.fromOptionK)(exports.FromEither);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainOptionK = (0, FromEither_1.chainOptionK)(exports.FromEither, exports.Chain);
/**
 * Use `flatMapOption`.
 *
 * @category legacy
 * @since 2.13.2
 */
exports.chainOptionKW = 
/*#__PURE__*/ exports.chainOptionK;
/** @internal */
var _FromEither = {
    fromEither: exports.FromEither.fromEither
};
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftNullable = _.liftNullable(_FromEither);
/**
 * @category lifting
 * @since 2.15.0
 */
exports.liftOption = _.liftOption(_FromEither);
/** @internal */
var _FlatMap = {
    flatMap: exports.flatMap
};
/** @internal */
var _FromIO = {
    fromIO: exports.FromIO.fromIO
};
/** @internal */
var _FromTask = {
    fromTask: exports.fromTask
};
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapNullable = _.flatMapNullable(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapOption = _.flatMapOption(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapEither = _.flatMapEither(_FromEither, _FlatMap);
/**
 * @category sequencing
 * @since 2.15.0
 */
exports.flatMapIO = _.flatMapIO(_FromIO, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTask = _.flatMapTask(_FromTask, _FlatMap);
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapIOEither = (0, function_1.dual)(2, function (self, f) {
    return (0, exports.flatMap)(self, (0, exports.fromIOEitherK)(f));
});
/**
 * @category sequencing
 * @since 2.16.0
 */
exports.flatMapTaskOption = (0, function_1.dual)(3, function (self, f, onNone) {
    return (0, exports.flatMap)(self, function (a) { return (0, exports.fromTaskOption)(function () { return onNone(a); })(f(a)); });
});
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainEitherK = exports.flatMapEither;
/**
 * Alias of `flatMapEither`.
 *
 * @category legacy
 * @since 2.6.1
 */
exports.chainEitherKW = exports.flatMapEither;
/**
 * Alias of `tapEither`.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherK = exports.tapEither;
/**
 * Alias of `tapEither`.
 *
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.12.0
 */
exports.chainFirstEitherKW = exports.tapEither;
/**
 * @category lifting
 * @since 2.0.0
 */
exports.fromPredicate = (0, FromEither_1.fromPredicate)(exports.FromEither);
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filterOrElse = (0, FromEither_1.filterOrElse)(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category filtering
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * @category lifting
 * @since 2.4.0
 */
exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromIOK = (0, FromIO_1.fromIOK)(exports.FromIO);
/**
 * Alias of `flatMapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainIOK = exports.flatMapIO;
/**
 * Alias of `tapIO`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstIOK = exports.tapIO;
/**
 * @category lifting
 * @since 2.10.0
 */
exports.fromTaskK = (0, FromTask_1.fromTaskK)(exports.FromTask);
/**
 * Alias of `flatMapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainTaskK = exports.flatMapTask;
/**
 * Alias of `tapTask`.
 *
 * @category legacy
 * @since 2.10.0
 */
exports.chainFirstTaskK = exports.tapTask;
/**
 * Alias of `flatMapIOEither`.
 *
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category legacy
 * @since 2.6.1
 */
exports.chainIOEitherKW = exports.flatMapIOEither;
/**
 * Alias of `flatMapIOEither`.
 *
 * @category legacy
 * @since 2.4.0
 */
exports.chainIOEitherK = exports.flatMapIOEither;
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) { return (e != null ? resolve(_.left(e)) : resolve(_.right(r))); };
                f.apply(null, args.concat(cbResolver));
            });
        };
    };
}
exports.taskify = taskify;
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) { return (0, exports.bracketW)(acquire, use, release); };
exports.bracket = bracket;
/**
 * Less strict version of [`bracket`](#bracket).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @since 2.12.0
 */
var bracketW = function (acquire, use, release) {
    return (0, exports.flatMap)(acquire, function (a) { return T.flatMap(use(a), function (e) { return (0, exports.flatMap)(release(a, e), function () { return T.of(e); }); }); });
};
exports.bracketW = bracketW;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.9.0
 */
exports.Do = (0, exports.of)(_.emptyRecord);
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
exports["let"] = let_;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.bind = chainable.bind(exports.Chain);
/**
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.bindW = exports.bind;
/**
 * @category do notation
 * @since 2.8.0
 */
exports.apS = (0, Apply_1.apS)(exports.ApplyPar);
/**
 * Less strict version of [`apS`](#aps).
 *
 * The `W` suffix (short for **W**idening) means that the error types will be merged.
 *
 * @category do notation
 * @since 2.8.0
 */
exports.apSW = exports.apS;
/**
 * @since 2.11.0
 */
exports.ApT = (0, exports.of)(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return (0, function_1.flow)(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(E.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndex)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) {
    return function (as) {
        return function () {
            return _.tail(as).reduce(function (acc, a, i) {
                return acc.then(function (ebs) {
                    return _.isLeft(ebs)
                        ? acc
                        : f(i + 1, a)().then(function (eb) {
                            if (_.isLeft(eb)) {
                                return eb;
                            }
                            ebs.right.push(eb.right);
                            return ebs;
                        });
                });
            }, f(0, _.head(as))().then(E.map(_.singleton)));
        };
    };
};
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = (0, exports.traverseReadonlyNonEmptyArrayWithIndexSeq)(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndex)(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/ (0, exports.traverseArray)(function_1.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return (0, exports.traverseReadonlyArrayWithIndexSeq)(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @category traversing
 * @since 2.9.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/ (0, exports.traverseSeqArray)(function_1.identity);
// -------------------------------------------------------------------------------------
// legacy
// -------------------------------------------------------------------------------------
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chain = exports.flatMap;
/**
 * Alias of `flatMap`.
 *
 * @category legacy
 * @since 2.6.0
 */
exports.chainW = exports.flatMap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.0.0
 */
exports.chainFirst = exports.tap;
/**
 * Alias of `tap`.
 *
 * @category legacy
 * @since 2.8.0
 */
exports.chainFirstW = exports.tap;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.orElseFirst = exports.tapError;
/**
 * Alias of `tapError`.
 *
 * @category legacy
 * @since 2.11.0
 */
exports.orElseFirstW = exports.tapError;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEither`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEither = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    map: _map,
    of: exports.of,
    ap: _apPar,
    chain: exports.flatMap,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `TE.Functor` instead of `TE.taskEitherSeq`
 * (where `TE` is from `import TE from 'fp-ts/TaskEither'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.taskEitherSeq = {
    URI: exports.URI,
    bimap: exports.mapBoth,
    mapLeft: exports.mapError,
    map: _map,
    of: exports.of,
    ap: _apSeq,
    chain: exports.flatMap,
    alt: _alt,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/ (0, Apply_1.getApplySemigroup)(exports.ApplySeq);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/ (0, Applicative_1.getApplicativeMonoid)(exports.ApplicativeSeq);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return (0, Apply_1.getApplySemigroup)(T.ApplySeq)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeTaskValidation`](#getapplicativetaskvalidation) and [`getAltTaskValidation`](#getalttaskvalidation) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function getTaskValidation(SE) {
    var applicativeTaskValidation = getApplicativeTaskValidation(T.ApplicativePar, SE);
    var altTaskValidation = getAltTaskValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: applicativeTaskValidation.ap,
        of: exports.of,
        chain: exports.flatMap,
        bimap: exports.mapBoth,
        mapLeft: exports.mapError,
        alt: altTaskValidation.alt,
        fromIO: exports.fromIO,
        fromTask: exports.fromTask,
        throwError: exports.throwError
    };
}
exports.getTaskValidation = getTaskValidation;


/***/ }),

/***/ 4384:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.filterE = exports.witherDefault = exports.wiltDefault = void 0;
var _ = __importStar(__nccwpck_require__(1840));
function wiltDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.separate); };
    };
}
exports.wiltDefault = wiltDefault;
function witherDefault(T, C) {
    return function (F) {
        var traverseF = T.traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), C.compact); };
    };
}
exports.witherDefault = witherDefault;
function filterE(W) {
    return function (F) {
        var witherF = W.wither(F);
        return function (predicate) { return function (ga) { return witherF(ga, function (a) { return F.map(predicate(a), function (b) { return (b ? _.some(a) : _.none); }); }); }; };
    };
}
exports.filterE = filterE;


/***/ }),

/***/ 9734:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.guard = void 0;
function guard(F, P) {
    return function (b) { return (b ? P.of(undefined) : F.zero()); };
}
exports.guard = guard;


/***/ }),

/***/ 6985:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dual = exports.getEndomorphismMonoid = exports.not = exports.SK = exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.unsafeCoerce = exports.identity = exports.apply = exports.getRing = exports.getSemiring = exports.getMonoid = exports.getSemigroup = exports.getBooleanAlgebra = void 0;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var getBooleanAlgebra = function (B) {
    return function () { return ({
        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
        zero: function () { return B.zero; },
        one: function () { return B.one; },
        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
        not: function (x) { return function (a) { return B.not(x(a)); }; }
    }); };
};
exports.getBooleanAlgebra = getBooleanAlgebra;
/**
 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
 *
 * @example
 * import { Predicate, getSemigroup } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const S1 = getSemigroup(B.SemigroupAll)<number>()
 *
 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
 *
 * const S2 = getSemigroup(B.SemigroupAny)<number>()
 *
 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getSemigroup = function (S) {
    return function () { return ({
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    }); };
};
exports.getSemigroup = getSemigroup;
/**
 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
 *
 * @example
 * import { Predicate } from 'fp-ts/Predicate'
 * import { getMonoid } from 'fp-ts/function'
 * import * as B from 'fp-ts/boolean'
 *
 * const f: Predicate<number> = (n) => n <= 2
 * const g: Predicate<number> = (n) => n >= 0
 *
 * const M1 = getMonoid(B.MonoidAll)<number>()
 *
 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
 *
 * const M2 = getMonoid(B.MonoidAny)<number>()
 *
 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
 *
 * @category instances
 * @since 2.10.0
 */
var getMonoid = function (M) {
    var getSemigroupM = (0, exports.getSemigroup)(M);
    return function () { return ({
        concat: getSemigroupM().concat,
        empty: function () { return M.empty; }
    }); };
};
exports.getMonoid = getMonoid;
/**
 * @category instances
 * @since 2.10.0
 */
var getSemiring = function (S) { return ({
    add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
    zero: function () { return S.zero; },
    mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
    one: function () { return S.one; }
}); };
exports.getSemiring = getSemiring;
/**
 * @category instances
 * @since 2.10.0
 */
var getRing = function (R) {
    var S = (0, exports.getSemiring)(R);
    return {
        add: S.add,
        mul: S.mul,
        one: S.one,
        zero: S.zero,
        sub: function (f, g) { return function (x) { return R.sub(f(x), g(x)); }; }
    };
};
exports.getRing = getRing;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
var apply = function (a) {
    return function (f) {
        return f(a);
    };
};
exports.apply = apply;
/**
 * @since 2.0.0
 */
function identity(a) {
    return a;
}
exports.identity = identity;
/**
 * @since 2.0.0
 */
exports.unsafeCoerce = identity;
/**
 * @since 2.0.0
 */
function constant(a) {
    return function () { return a; };
}
exports.constant = constant;
/**
 * A thunk that returns always `true`.
 *
 * @since 2.0.0
 */
exports.constTrue = constant(true);
/**
 * A thunk that returns always `false`.
 *
 * @since 2.0.0
 */
exports.constFalse = constant(false);
/**
 * A thunk that returns always `null`.
 *
 * @since 2.0.0
 */
exports.constNull = constant(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @since 2.0.0
 */
exports.constUndefined = constant(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @since 2.0.0
 */
exports.constVoid = exports.constUndefined;
function flip(f) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 1) {
            return f(args[1], args[0]);
        }
        return function (a) { return f(a)(args[0]); };
    };
}
exports.flip = flip;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    switch (arguments.length) {
        case 1:
            return ab;
        case 2:
            return function () {
                return bc(ab.apply(this, arguments));
            };
        case 3:
            return function () {
                return cd(bc(ab.apply(this, arguments)));
            };
        case 4:
            return function () {
                return de(cd(bc(ab.apply(this, arguments))));
            };
        case 5:
            return function () {
                return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
        case 6:
            return function () {
                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
        case 7:
            return function () {
                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
        case 8:
            return function () {
                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
        case 9:
            return function () {
                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
    }
    return;
}
exports.flow = flow;
/**
 * @since 2.0.0
 */
function tuple() {
    var t = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        t[_i] = arguments[_i];
    }
    return t;
}
exports.tuple = tuple;
/**
 * @since 2.0.0
 */
function increment(n) {
    return n + 1;
}
exports.increment = increment;
/**
 * @since 2.0.0
 */
function decrement(n) {
    return n - 1;
}
exports.decrement = decrement;
/**
 * @since 2.0.0
 */
function absurd(_) {
    throw new Error('Called `absurd` function which should be uncallable');
}
exports.absurd = absurd;
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from 'fp-ts/function'
 *
 * const add = tupled((x: number, y: number): number => x + y)
 *
 * assert.strictEqual(add([1, 2]), 3)
 *
 * @since 2.4.0
 */
function tupled(f) {
    return function (a) { return f.apply(void 0, a); };
}
exports.tupled = tupled;
/**
 * Inverse function of `tupled`
 *
 * @since 2.4.0
 */
function untupled(f) {
    return function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return f(a);
    };
}
exports.untupled = untupled;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab(a);
        case 3:
            return bc(ab(a));
        case 4:
            return cd(bc(ab(a)));
        case 5:
            return de(cd(bc(ab(a))));
        case 6:
            return ef(de(cd(bc(ab(a)))));
        case 7:
            return fg(ef(de(cd(bc(ab(a))))));
        case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
        case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
        default: {
            var ret = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret);
            }
            return ret;
        }
    }
}
exports.pipe = pipe;
/**
 * Type hole simulation
 *
 * @since 2.7.0
 */
exports.hole = absurd;
/**
 * @since 2.11.0
 */
var SK = function (_, b) { return b; };
exports.SK = SK;
/**
 * Use `Predicate` module instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
function not(predicate) {
    return function (a) { return !predicate(a); };
}
exports.not = not;
/**
 * Use `Endomorphism` module instead.
 *
 * @category zone of death
 * @since 2.10.0
 * @deprecated
 */
var getEndomorphismMonoid = function () { return ({
    concat: function (first, second) { return flow(first, second); },
    empty: identity
}); };
exports.getEndomorphismMonoid = getEndomorphismMonoid;
/** @internal */
var dual = function (arity, body) {
    var isDataFirst = typeof arity === 'number' ? function (args) { return args.length >= arity; } : arity;
    return function () {
        var args = Array.from(arguments);
        if (isDataFirst(arguments)) {
            return body.apply(this, args);
        }
        return function (self) { return body.apply(void 0, __spreadArray([self], args, false)); };
    };
};
exports.dual = dual;


/***/ }),

/***/ 1840:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.flatMapReader = exports.flatMapTask = exports.flatMapIO = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.fromReadonlyNonEmptyArray = exports.has = exports.emptyRecord = exports.emptyReadonlyArray = exports.tail = exports.head = exports.isNonEmpty = exports.singleton = exports.right = exports.left = exports.isRight = exports.isLeft = exports.some = exports.none = exports.isSome = exports.isNone = void 0;
var function_1 = __nccwpck_require__(6985);
// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------
/** @internal */
var isNone = function (fa) { return fa._tag === 'None'; };
exports.isNone = isNone;
/** @internal */
var isSome = function (fa) { return fa._tag === 'Some'; };
exports.isSome = isSome;
/** @internal */
exports.none = { _tag: 'None' };
/** @internal */
var some = function (a) { return ({ _tag: 'Some', value: a }); };
exports.some = some;
// -------------------------------------------------------------------------------------
// Either
// -------------------------------------------------------------------------------------
/** @internal */
var isLeft = function (ma) { return ma._tag === 'Left'; };
exports.isLeft = isLeft;
/** @internal */
var isRight = function (ma) { return ma._tag === 'Right'; };
exports.isRight = isRight;
/** @internal */
var left = function (e) { return ({ _tag: 'Left', left: e }); };
exports.left = left;
/** @internal */
var right = function (a) { return ({ _tag: 'Right', right: a }); };
exports.right = right;
// -------------------------------------------------------------------------------------
// ReadonlyNonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var singleton = function (a) { return [a]; };
exports.singleton = singleton;
/** @internal */
var isNonEmpty = function (as) { return as.length > 0; };
exports.isNonEmpty = isNonEmpty;
/** @internal */
var head = function (as) { return as[0]; };
exports.head = head;
/** @internal */
var tail = function (as) { return as.slice(1); };
exports.tail = tail;
// -------------------------------------------------------------------------------------
// empty
// -------------------------------------------------------------------------------------
/** @internal */
exports.emptyReadonlyArray = [];
/** @internal */
exports.emptyRecord = {};
// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------
/** @internal */
exports.has = Object.prototype.hasOwnProperty;
// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------
/** @internal */
var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1), true); };
exports.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray;
/** @internal */
var liftNullable = function (F) {
    return function (f, onNullable) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither(o == null ? (0, exports.left)(onNullable.apply(void 0, a)) : (0, exports.right)(o));
        };
    };
};
exports.liftNullable = liftNullable;
/** @internal */
var liftOption = function (F) {
    return function (f, onNone) {
        return function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            var o = f.apply(void 0, a);
            return F.fromEither((0, exports.isNone)(o) ? (0, exports.left)(onNone.apply(void 0, a)) : (0, exports.right)(o.value));
        };
    };
};
exports.liftOption = liftOption;
/** @internal */
var flatMapNullable = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(3, function (self, f, onNullable) {
        return M.flatMap(self, (0, exports.liftNullable)(F)(f, onNullable));
    });
};
exports.flatMapNullable = flatMapNullable;
/** @internal */
var flatMapOption = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(3, function (self, f, onNone) { return M.flatMap(self, (0, exports.liftOption)(F)(f, onNone)); });
};
exports.flatMapOption = flatMapOption;
/** @internal */
var flatMapEither = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromEither(f(a)); });
    });
};
exports.flatMapEither = flatMapEither;
/** @internal */
var flatMapIO = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromIO(f(a)); });
    });
};
exports.flatMapIO = flatMapIO;
/** @internal */
var flatMapTask = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromTask(f(a)); });
    });
};
exports.flatMapTask = flatMapTask;
/** @internal */
var flatMapReader = function (F, M) {
    /*#__PURE__*/ return (0, function_1.dual)(2, function (self, f) {
        return M.flatMap(self, function (a) { return F.fromReader(f(a)); });
    });
};
exports.flatMapReader = flatMapReader;


/***/ }),

/***/ 1310:
/***/ (function(module, exports) {

;(function(root) {
  'use strict';

  function isBase64(v, opts) {
    if (v instanceof Boolean || typeof v === 'boolean') {
      return false
    }

    if (!(opts instanceof Object)) {
      opts = {}
    }

    if (opts.allowEmpty === false && v === '') {
      return false
    }

    var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?'
    var mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)'

    if (opts.mimeRequired === true) {
      regex =  mimeRegex + regex
    } else if (opts.allowMime === true) {
      regex = mimeRegex + '?' + regex
    }

    if (opts.paddingRequired === false) {
      regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
    }

    return (new RegExp('^' + regex + '$', 'gi')).test(v)
  }

  if (true) {
    if ( true && module.exports) {
      exports = module.exports = isBase64
    }
    exports.isBase64 = isBase64
  } else {}
})(this);


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 6144:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const core = __importStar(__nccwpck_require__(2186));
const main_1 = __nccwpck_require__(399);
async function wrap_install() {
    await new main_1.AuthenticateSteamCMD().run().catch(error => core.setFailed(error));
}
void wrap_install();


/***/ }),

/***/ 4081:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function discernActionInputErrorReason(error, context) {
    if (!(error instanceof Error)) {
        if (error instanceof String)
            return `Unknown: ${error}}`;
        return 'Unknown: thrown value not an Error';
    }
    return `${error.name}: ${error.message}`;
}
exports["default"] = discernActionInputErrorReason;


/***/ }),

/***/ 1874:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
function ActionLogGroup(groupTitle) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return function (target, propertyKey, descriptor) {
        const oldFunction = descriptor.value;
        descriptor.value = async function (...args) {
            core.startGroup(groupTitle);
            try {
                return await oldFunction.apply(target, args);
            }
            finally {
                core.endGroup();
            }
        };
    };
}
exports["default"] = ActionLogGroup;


/***/ }),

/***/ 1682:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionLogGroup = void 0;
var action_log_group_1 = __nccwpck_require__(1874);
Object.defineProperty(exports, "ActionLogGroup", ({ enumerable: true, get: function () { return __importDefault(action_log_group_1).default; } }));


/***/ }),

/***/ 6043:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const is_errno_exception_1 = __importDefault(__nccwpck_require__(6309));
// https://nodejs.org/api/errors.html#common-system-errors
function reasonBySystemErrorCode(errorCode, context) {
    switch (errorCode) {
        case 'EACCESS':
            return `Permission denied to ${context.file}. Access of the requested type is forbidden by file permissions.`;
        case 'EEXIST':
            return `${context.file} already exists and conflicts with the requested operation.`;
        case 'EISDIR':
            return `${context.file} is unexpectedly a directory.`;
        case 'EMFILE':
            return `Too many file handles are open concurrently.`;
        case 'ENOENT':
            return `The file or directory ${context.file} does not exist.`;
        case 'ENOTDIR':
            return `${context.file} is unexpectedly not a directory.`;
        case 'ENOTEMPTY':
            return `The directory ${context.file} is not empty.`;
        case 'EPERM':
            return `The requested operation requires elevated privileges.`;
        case 'ETIMEDOUT':
            return `The requested operation timed out.`;
    }
}
function discernFileSystemErrorReason(error, context) {
    if (!(error instanceof Error)) {
        if (error instanceof String)
            return `Unknown: ${error}}`;
        return 'Unknown: thrown value not an Error';
    }
    if ((0, is_errno_exception_1.default)(error) && error.code) {
        const reason = reasonBySystemErrorCode(error.code, context);
        if (reason)
            return `${error.name}: ${error.code}: ${reason}`;
        return `${error.name}: ${error.code}: ${error.message}`;
    }
    return `${error.name}: ${error.message}`;
}
exports["default"] = discernFileSystemErrorReason;


/***/ }),

/***/ 6791:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isErrnoException = exports.discernActionInputErrorReason = exports.discernFileSystemErrorReason = void 0;
__exportStar(__nccwpck_require__(1682), exports);
var file_system_error_reason_1 = __nccwpck_require__(6043);
Object.defineProperty(exports, "discernFileSystemErrorReason", ({ enumerable: true, get: function () { return __importDefault(file_system_error_reason_1).default; } }));
var action_input_error_reason_1 = __nccwpck_require__(4081);
Object.defineProperty(exports, "discernActionInputErrorReason", ({ enumerable: true, get: function () { return __importDefault(action_input_error_reason_1).default; } }));
var is_errno_exception_1 = __nccwpck_require__(6309);
Object.defineProperty(exports, "isErrnoException", ({ enumerable: true, get: function () { return __importDefault(is_errno_exception_1).default; } }));


/***/ }),

/***/ 6309:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Takeshi Tokugawa YD, under MIT License https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/6b8bf3ea831a8fed59f76bb23bacdb0b64701cb9/CoreLibrary/Package/Source/TypeGuards/Objects/isArbitraryObject.ts#L4
function isArbitraryObject(potentialObject) {
    return typeof potentialObject === 'object' && potentialObject !== null;
}
// Takeshi Tokugawa YD, under MIT License https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/6b8bf3ea831a8fed59f76bb23bacdb0b64701cb9/NodeJS/Package/Source/isErrnoException.ts#L10
function isErrnoException(error) {
    return (isArbitraryObject(error) &&
        error instanceof Error &&
        (typeof error.errno === 'number' || typeof error.errno === 'undefined') &&
        (typeof error.code === 'string' || typeof error.code === 'undefined') &&
        (typeof error.path === 'string' || typeof error.path === 'undefined') &&
        (typeof error.syscall === 'string' || typeof error.syscall === 'undefined'));
}
exports["default"] = isErrnoException;


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthenticateSteamCMD = void 0;
const core = __importStar(__nccwpck_require__(2186));
const exec = __importStar(__nccwpck_require__(1514));
const path_1 = __importDefault(__nccwpck_require__(1017));
const promises_1 = __importDefault(__nccwpck_require__(3292));
const function_1 = __nccwpck_require__(6985);
const TE = __importStar(__nccwpck_require__(437));
const is_base64_1 = __importDefault(__nccwpck_require__(1310));
const lib_1 = __nccwpck_require__(6791);
class AuthenticateSteamCMD {
    /**
     * The main function for the action.
     * @returns {Promise<void>} Resolves when the action is complete.
     */
    async run() {
        const task = (0, function_1.pipe)(this.getInputsTaskEither(), TE.bindW('steamConfigDirectory', state => this.ensureSteamConfigDirTaskEither(state)), TE.bindW('steamConfigFile', state => this.writeSteamConfigFileTaskEither(state)), TE.tap(state => this.testLoginSucceedsTaskEither(state)), TE.getOrElse(error => {
            throw error;
        }));
        await task();
    }
    getInputsTaskEither() {
        return TE.tryCatch(() => this.getInputs(), reason => reason);
    }
    getRequiredInput(key) {
        try {
            return core.getInput(key, { required: true, trimWhitespace: true });
        }
        catch (error) {
            core.error((0, lib_1.discernActionInputErrorReason)(error, { inputKey: key }));
            throw error;
        }
    }
    getInputOrDefault(key, fallback) {
        const provided = core.getInput(key, { trimWhitespace: true });
        if (provided)
            return provided;
        core.info(`Falling back to lazy default for ${key}`);
        return fallback();
    }
    async expandEnvVars(value) {
        return await exec
            .getExecOutput('bash', ['-c', `echo "${value}"`], {
            ignoreReturnCode: false
        })
            .then(result => result.stdout)
            .then(stdout => stdout.trim());
    }
    async getInputs() {
        const configValveDataFormatBase64Encoded = this.getRequiredInput('steam_config_vdf');
        if (!(0, is_base64_1.default)(configValveDataFormatBase64Encoded)) {
            core.error("Provided 'steam_config_vdf' input is not Base64 encoded. Aborting.");
            throw new Error("Encoding of 'steam_config_vdf' is not Base64.");
        }
        core.info('Decoding steam config.vdf contents...');
        const configValveDataFormat = Buffer.from(configValveDataFormatBase64Encoded, 'base64');
        core.info('Steam config.vdf decoded.');
        const steamHomeCompacted = this.getInputOrDefault('steam_home', () => '$HOME/Steam');
        const steamHome = await this.expandEnvVars(steamHomeCompacted);
        core.info(`Steam home is ${steamHome}`);
        const steamUsername = this.getRequiredInput('steam_username');
        core.info('Got steam username.');
        core.info('Done.');
        return { configValveDataFormat, steamHome, steamUsername };
    }
    ensureSteamConfigDirTaskEither({ steamHome }) {
        return TE.tryCatch(() => this.ensureSteamConfigDir(steamHome), reason => reason);
    }
    async ensureSteamConfigDir(steamHome) {
        const steamConfigDir = path_1.default.join(steamHome, 'config');
        try {
            core.info(`Ensuring directory ${steamConfigDir}...`);
            // will not throw if directory already exists
            await promises_1.default.mkdir(steamConfigDir, { recursive: true });
            core.info('Done.');
            return steamConfigDir;
        }
        catch (error) {
            core.error(`Couldn't ensure steam config directory. Reason: ${(0, lib_1.discernFileSystemErrorReason)(error, { file: steamConfigDir })}`);
            throw error;
        }
    }
    writeSteamConfigFileTaskEither({ steamConfigDirectory, configValveDataFormat }) {
        return TE.tryCatch(() => this.writeSteamConfigFile(steamConfigDirectory, configValveDataFormat), reason => reason);
    }
    async writeFile(file, content, options = null) {
        if (typeof options === 'string') {
            options = {
                encoding: options
            };
        }
        let fileHandle;
        try {
            core.info(`Opening ${file} for writing...`);
            // will throw if file already exists
            fileHandle = await promises_1.default.open(file, 'w', options?.mode);
            core.info(`Writing contents...`);
            await fileHandle.writeFile(content, options);
            if (options?.mode) {
                core.info(`Setting file permissions...`);
                await fileHandle.chmod(options.mode);
            }
        }
        finally {
            if (fileHandle) {
                core.info(`Closing ${file}...`);
                await fileHandle.close();
            }
        }
        core.info('Done.');
        return file;
    }
    async writeSteamConfigFile(steamConfigDirectory, configValveDataFormat) {
        const steamConfigFile = path_1.default.join(steamConfigDirectory, 'config.vdf');
        try {
            await this.writeFile(steamConfigFile, configValveDataFormat, {
                encoding: 'ascii',
                mode: 0o777
            });
        }
        catch (error) {
            core.error(`Failed to write Steam config. Reason: ${(0, lib_1.discernFileSystemErrorReason)(error, { file: steamConfigFile })}`);
            throw error;
        }
    }
    testLoginSucceedsTaskEither({ steamUsername }) {
        return TE.tryCatch(() => this.testLoginSucceeds(steamUsername), reason => reason);
    }
    async testLoginSucceeds(steamUsername) {
        core.info('Attempting SteamCMD login...');
        // U+0004: 'End of Transmission' - if prompted for a password, fail immediately
        const loginExitCode = await exec.exec('steamcmd', [
            '+set_steam_guard_code',
            'INVALID',
            '+login',
            `${steamUsername}`,
            '+quit'
        ], {
            ignoreReturnCode: true,
            input: Buffer.from('\u0004')
        });
        if (loginExitCode === 0) {
            console.info('Login succeeded.');
            return;
        }
        console.error('Login failed!');
        throw new Error('Failed to login with SteamCMD');
    }
}
exports.AuthenticateSteamCMD = AuthenticateSteamCMD;
__decorate([
    (0, lib_1.ActionLogGroup)('Getting inputs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthenticateSteamCMD.prototype, "getInputs", null);
__decorate([
    (0, lib_1.ActionLogGroup)('Ensuring steam config directory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticateSteamCMD.prototype, "ensureSteamConfigDir", null);
__decorate([
    (0, lib_1.ActionLogGroup)('Writing config file'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Buffer]),
    __metadata("design:returntype", Promise)
], AuthenticateSteamCMD.prototype, "writeSteamConfigFile", null);
__decorate([
    (0, lib_1.ActionLogGroup)('Testing login succeeds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticateSteamCMD.prototype, "testLoginSucceeds", null);


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(6144);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;