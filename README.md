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
