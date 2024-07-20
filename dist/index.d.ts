type ThrowErrorResponse = {
    error: "unknown" | {
        issues: ({
            code: "invalid_type";
            expected: string;
            received: string;
            path: [number, ...string[]];
            message: string;
        } | {
            code: "too_small";
            message: string;
            minimum: number;
            path: [];
        })[];
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
    export type Instance = new (createPins: PinportClient<any>["createPins"], getPins: PinportClient<any>["getPins"], updatePins: PinportClient<any>["updatePins"], deletePins: PinportClient<any>["deletePins"]) => any;
    export interface Extension {
        key: string;
        instance: Instance;
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
     * Updates multiple pins by sending a PUT request to the Pinport API.
     * @param {Array<Partial<Omit<Pinport.Pin, "id">> & { id: string }>} pins - Array of pin objects to be updated. Each object must include the `id` of the pin to be updated.
     * @returns {Promise<Pinport.Pin[]>} A promise that resolves to an array of updated pin objects.
     *
     * @remarks
     * The `id` property is required to identify which pin to update.
     *
     * @example
     * ```typescript
     * const pinsToUpdate: Array<Partial<Omit<Pinport.Pin, "id">> & { id: string }> = [
     *   {
     *     id: "pin1",
     *     position: { x: 2, y: 3, z: 4 },
     *     html: "<div>Updated Pin 1</div>"
     *   },
     *   {
     *     id: "pin2",
     *     opacity: 1.0,
     *     enableLine: true
     *   }
     * ];
     *
     * updatePins(pinsToUpdate).then((response) => {
     *   console.log("Updated pins:", response);
     * }).catch((error: Pinport.ErrorResponse) => {
     *   console.error("Error updating pins:", error);
     * });
     * ```
     */
    updatePins(pins: (Partial<Omit<Pinport.Pin, "id">> & {
        id: Pinport.Pin["id"];
    })[]): Promise<Pin[]>;
    /**
     * Deletes multiple pins by sending a DELETE request to the Pinport API.
     * @param {string[]} ids - Array of pin IDs to be deleted.
     * @returns {Promise<{ deleted: number }>} A promise that resolves to an object containing the number of deleted pins.
     *
     * @remarks
     * The `id` property is required to identify which pins to delete.
     *
     * @example
     * ```typescript
     * const idsToDelete: string[] = ["pin1", "pin2"];
     *
     * deletePins(idsToDelete).then((response) => {
     *   console.log("Deleted pins count:", response.deleted);
     * }).catch((error: Pinport.ErrorResponse) => {
     *   console.error("Error deleting pins:", error);
     * });
     * ```
     */
    deletePins(ids: Pinport.Pin["id"][]): Promise<{
        deleted: number;
    }>;
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
