// Takeshi Tokugawa YD, under MIT License https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/6b8bf3ea831a8fed59f76bb23bacdb0b64701cb9/CoreLibrary/Package/Source/Types/ArbitraryObject.ts
type ArbitraryObject = { [key: string]: unknown; };

// Takeshi Tokugawa YD, under MIT License https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/6b8bf3ea831a8fed59f76bb23bacdb0b64701cb9/CoreLibrary/Package/Source/TypeGuards/Objects/isArbitraryObject.ts#L4
function isArbitraryObject(potentialObject: unknown): potentialObject is ArbitraryObject {
  return typeof potentialObject === "object" && potentialObject !== null;
}

// Takeshi Tokugawa YD, under MIT License https://github.com/TokugawaTakeshi/Yamato-Daiwa-ES-Extensions/blob/6b8bf3ea831a8fed59f76bb23bacdb0b64701cb9/NodeJS/Package/Source/isErrnoException.ts#L10
export default function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return isArbitraryObject(error) &&
    error instanceof Error &&
    (typeof error.errno === "number" || typeof error.errno === "undefined") &&
    (typeof error.code === "string" || typeof error.code === "undefined") &&
    (typeof error.path === "string" || typeof error.path === "undefined") &&
    (typeof error.syscall === "string" || typeof error.syscall === "undefined");
}
