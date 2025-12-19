declare module "supercluster" {
    interface SuperclusterOptions {
        radius?: number;
        maxZoom?: number;
        minZoom?: number;
        minPoints?: number;
        extent?: number;
        nodeSize?: number;
        log?: boolean;
        reduce?: (accumulated: any, props: any) => void;
        map?: (props: any) => any;
    }

    export default class Supercluster<T = any> {
        constructor(options?: SuperclusterOptions);

        load(points: any[]): void;

        getClusters(
            bbox: [number, number, number, number],
            zoom: number
        ): any[];

        getLeaves(
            clusterId: number,
            limit: number,
            offset: number
        ): any[];

        getClusterExpansionZoom(clusterId: number): number;
    }
}
