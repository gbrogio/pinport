# PinportClient

PinportClient is a TypeScript client for interacting with the Pinport API. It allows for creating and retrieving pins on the Pinport platform.

## Installation

To install the PinportClient, use the following command:

```bash
npm install @pinport/client
```

## Usage

### Importing and Initializing

To use the PinportClient, you need to import it and initialize an instance with your API URL and key:

```typescript
import { PinportClient } from "@pinport/client";

const pinport = new PinportClient("<api_url>", "<private_key> or <public_key>");
```

### Creating Pins

You can create multiple pins by sending a POST request to the Pinport API. The createPins method takes an array of pin objects to be created.

```typescript
const pinsToCreate: Pinport.CreatePin[] = [
  {
    meta_id: "meta1",
    position: { x: 1, y: 2, z: 3 },
    offset: { x: 0, y: 0, z: 0 },
    html: "<div>Pin 1</div>",
    opacity: 0.8,
    enableLine: true,
    alert: false,
    icon: "icon1",
  },
  {
    meta_id: "meta2",
    position: { x: 4, y: 5, z: 6 },
    offset: { x: 1, y: 1, z: 1 },
    html: "<div>Pin 2</div>",
    opacity: 0.9,
    enableLine: false,
    alert: true,
    icon: "icon2",
  },
];

pinport
  .createPins(pinsToCreate)
  .then((response) => {
    console.log("Created pins:", response);
  })
  .catch((error: Pinport.ErrorResponse) => {
    console.error("Error creating pins:", error);
  });
```

### Retrieving Pins

You can retrieve all pins by sending a GET request to the Pinport API. The getPins method takes a `meta_id` for searching pins.

```typescript
pinport.getPins('meta1').then((response) => {
  console.log("Retrieved pins:", response);
}).catch((error: Pinport.ErrorResponse) => {
  console.error("Error retrieving pins:", error);
});
```

### Updating Pins

You can update existing pins by sending a PUT request to the Pinport API. The updatePins method takes an array of pin objects with updated properties.

```typescript
const pinsToUpdate: Pinport.UpdatePin[] = [
  {
    id: "pin1",
    position: { x: 2, y: 3, z: 4 },
    offset: { x: 0, y: 0, z: 0 },
    html: "<div>Updated Pin 1</div>",
    opacity: 0.7,
    enableLine: true,
    alert: false,
    icon: "icon1",
  },
  {
    id: "pin2",
    position: { x: 5, y: 6, z: 7 },
    offset: { x: 1, y: 1, z: 1 },
    html: "<div>Updated Pin 2</div>",
    opacity: 0.9,
    enableLine: false,
    alert: true,
    icon: "icon2",
  },
];

pinport
  .updatePins(pinsToUpdate)
  .then((response) => {
    console.log("Updated pins:", response);
  })
  .catch((error: Pinport.ErrorResponse) => {
    console.error("Error updating pins:", error);
  });
```

### Deleting Pins

You can delete pins by sending a DELETE request to the Pinport API. The deletePins method takes an array of pin IDs to be deleted.

```typescript
const pinIdsToDelete: string[] = ["pin1", "pin2"];

pinport
  .deletePins(pinIdsToDelete)
  .then((response) => {
    console.log("Deleted pins:", response);
  })
  .catch((error: Pinport.ErrorResponse) => {
    console.error("Error deleting pins:", error);
  });
```

### Getting Metadata

You can retrieve metadata by sending a GET request to the Pinport API. The getMetadata method takes a `meta_id` for retrieving metadata.

```typescript
pinport.getMetadata('meta1').then((response) => {
  console.log("Retrieved metadata:", response);
}).catch((error: Pinport.ErrorResponse) => {
  console.error("Error retrieving metadata:", error);
});
```

### Extensions

PinportClient supports extensions that can be used to extend its functionality. Extensions are initialized during the PinportClient instance creation.

```typescript
import { PinportMatterporExtension } from "@pinport/matterport";

const pinport = new PinportClient(
  '<api_url>',
  '<private_key>',
  { extensions: [PinportMatterporExtension] },
);
// now you can access
const pinportMatterport = pinport.extensions.matterport
```
