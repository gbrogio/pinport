type ThrowErrorResponse = {
    error: "unknown" | {
        issues: [];
    };
};

type Pin = {
    id: string;
    meta_id: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    offset: {
        x: number;
        y: number;
        z: number;
    };
    html: string;
    opacity: number;
    enableLine: boolean;
    alert: boolean;
    icon: string;
};
type CreatePin = {
    meta_id: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    offset?: {
        x: number;
        y: number;
        z: number;
    };
    html: string;
    opacity?: number;
    enableLine?: boolean;
    alert?: boolean;
    icon?: string;
};

/**
 * Namespace for Pinport client types.
 */
declare namespace Pinport {
    export type { Pin, CreatePin };
    export type ErrorResponse = ThrowErrorResponse;
    export type PinportFetch = <T>(input: string | URL | globalThis.Request, init?: RequestInit) => Promise<T>;
    export interface Extension {
        key: string;
        instance: new (fetch: PinportFetch) => any;
    }
}
/**
 * Pinport client class for interacting with the Pinport API.
 * @template T - Array of extensions to be initialized.
 */
declare class PinportClient<T extends Pinport.Extension[]> {
    private apiUrl;
    private key;
    private options?;
    extensions: { [key in T[number]["key"]]: InstanceType<T[number]["instance"]>; };
    /**
     * Constructor for initializing the PinportClient instance.
     * @param {string} apiUrl - URL of the Pinport API.
     * @param {string} key - Public or private key for Pinport. Must be a valid JWT.
     * @param {object} [options] - Optional initialization options.
     * @param {RequestInit} [options.requestInit] - Optional RequestInit object for request configuration.
     * @param {Pinport.Extension[]} [options.extensions] - Optional array of Pinport extensions.
     * @throws {Error} Throws error if key is missing or not a valid JWT.
     *
     * @example
     * import { PinportClient } from "@pinport/client";
     *
     * const pinport = new PinportClient('<api_url>', '<private_key> or <public_key>');
     */
    constructor(apiUrl: string, key: string, options?: {
        requestInit?: RequestInit;
        extensions?: T;
    } | undefined);
    private initializeExtensions;
    private fetch;
    /**
     * Creates multiple pins by sending a POST request to the Pinport API.
     * @param {Pinport.CreatePin[]} pins - Array of pin objects to be created.
     * @returns {Promise<Pinport.Pin[]>} A promise that resolves to an array of created pin objects.
     *
     * @remarks
     * The `meta_id` property is a key that allows for easier searching of pins when calling `getPins`.
     *
     * @example
     * ```typescript
     * const pinsToCreate: Pinport.CreatePin[] = [
     *   {
     *     meta_id: "meta1",
     *     position: { x: 1, y: 2, z: 3 },
     *     offset: { x: 0, y: 0, z: 0 },
     *     html: "<div>Pin 1</div>",
     *     opacity: 0.8,
     *     enableLine: true,
     *     alert: false,
     *     icon: "icon1"
     *   },
     *   {
     *     meta_id: "meta2",
     *     position: { x: 4, y: 5, z: 6 },
     *     offset: { x: 1, y: 1, z: 1 },
     *     html: "<div>Pin 2</div>",
     *     opacity: 0.9,
     *     enableLine: false,
     *     alert: true,
     *     icon: "icon2"
     *   }
     * ];
     *
     * createPins(pinsToCreate).then((response) => {
     *   console.log("Created pins:", response);
     * }).catch((error: Pinport.ErrorResponse) => {
     *   console.error("Error creating pins:", error);
     * });
     * ```
     */
    createPins(pins: Pinport.CreatePin[]): Promise<Pin[]>;
    /**
     * Retrieves all pins by sending a GET request to the Pinport API.
     * @param {string} meta_id - Meta ID used for searching pins.
     * @returns {Promise<Pinport.Pin[]>} A promise that resolves to an array of pin objects.
     *
     * @example
     * ```typescript
     * getPins().then((response) => {
     *   console.log("Retrieved pins:", response);
     * }).catch((error: Pinport.ErrorResponse) => {
     *   console.error("Error retrieving pins:", error);
     * });
     * ```
     */
    getPins(meta_id: string): Promise<Pin[]>;
}

export { Pinport, PinportClient };
