export type Pin = {
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
export type CreatePin = {
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
