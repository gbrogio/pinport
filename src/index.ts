import thisFetch from "./browser";
import type { ThrowErrorResponse } from "./types/error";
import type { CreatePin, Pin } from "./types/pin";

/**
 * Namespace for Pinport client types.
 */
export declare namespace Pinport {
	export type { Pin, CreatePin };
	export type ErrorResponse = ThrowErrorResponse;
	export type PinportFetch = <T>(
		input: string | URL | globalThis.Request,
		init?: RequestInit,
	) => Promise<T>;

	export type Instance = new (
		createPins: PinportClient<any>["createPins"],
		getPins: PinportClient<any>["getPins"],
		updatePins: PinportClient<any>["updatePins"],
		deletePins: PinportClient<any>["deletePins"],
	) => any;

	export interface Extension {
		key: string;
		instance: Instance;
	}
}

/**
 * Pinport client class for interacting with the Pinport API.
 * @template T - Array of extensions to be initialized.
 */
export class PinportClient<T extends Pinport.Extension[]> {
	public extensions = {} as {
		[key in T[number]["key"]]: InstanceType<T[number]["instance"]>;
	};

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
	constructor(
		private apiUrl: string,
		private key: string,
		private options?: {
			requestInit?: RequestInit;
			extensions?: T;
		},
	) {
		if (!this.key) throw Error("Pinport public or private key is needed");
		if (this.key.split(".").length !== 3)
			throw Error("Pinport key must be a JWT.");

		this.initializeExtensions();
	}

	private initializeExtensions() {
		if (this.options?.extensions) {
			for (const ext of this.options.extensions) {
				this.extensions[ext.key as T[number]["key"]] = new ext.instance(
					this.createPins.bind(this),
					this.getPins.bind(this),
					this.updatePins.bind(this),
					this.deletePins.bind(this),
				);
			}
		}
	}

	private async fetch<T>(
		input: string | URL | globalThis.Request,
		init?: RequestInit,
	) {
		const response = await thisFetch(input, {
			...init,
			...this?.options?.requestInit,
			headers: {
				...init?.headers,
				...this?.options?.requestInit?.headers,
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.key}`,
			},
		});

		const res = response.json();
		if (response.status > 399) throw { ...res, status: response.status };
		return res as T;
	}

	/**
	 * Creates multiple pins by sending a POST request to the Pinport API.
	 * @param {Pinport.CreatePin[]} pins - Array of pin objects to be created.
	 * @returns {Promise<Pinport.Pin[]>} A promise that resolves to an array of created pin objects.
	 *
	 * @remarks
	 * The `meta_id` property is a key that allows for easier searching of pins when calling `getPins`.
	 * The `color` property is the pin color in hexadecimal.
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
	 *     icon: "icon1",
	 *     color: "#2a00ff",
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
	public async createPins(pins: Pinport.CreatePin[]) {
		return this.fetch<Pinport.Pin[]>(`${this.apiUrl}/pins`, {
			body: JSON.stringify(pins),
			method: "POST",
		});
	}

	/**
	 * Updates multiple pins by sending a PUT request to the Pinport API.
	 * @param {Array<Partial<Omit<Pinport.Pin, "id">> & { id: string }>} pins - Array of pin objects to be updated. Each object must include the `id` of the pin to be updated.
	 * @returns {Promise<Pinport.Pin[]>} A promise that resolves to an array of updated pin objects.
	 *
	 * @remarks
	 * The `id` property is required to identify which pin to update.
	 * The `color` property is the pin color in hexadecimal.
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
	 *     enableLine: true,
	 * 		 color: "#f10142"
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
	public async updatePins(
		pins: (Partial<Omit<Pinport.Pin, "id">> & { id: Pinport.Pin["id"] })[],
	) {
		return this.fetch<Pinport.Pin[]>(`${this.apiUrl}/pins`, {
			body: JSON.stringify(pins),
			method: "PUT",
		});
	}

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
	public async deletePins(ids: Pinport.Pin["id"][]) {
		return this.fetch<{ deleted: number }>(`${this.apiUrl}/pins`, {
			body: JSON.stringify(ids),
			method: "DELETE",
		});
	}

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
	public async getPins(meta_id: string) {
		return this.fetch<Pinport.Pin[]>(`${this.apiUrl}/pins?meta-id=${meta_id}`);
	}
}
