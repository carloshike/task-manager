export interface Adapter<T> {
    adapt(item: any, item2: any): T;
}
